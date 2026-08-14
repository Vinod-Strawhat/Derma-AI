"""
DermaAI backend API.

Endpoints:
    GET  /api/health           -> {"status": "ok"}
    GET  /api/meta             -> class names, gender values, regions
    POST /api/auth/signup      -> create a user account (rate limited)
    POST /api/auth/login       -> sign in, get a JWT (rate limited)
    GET  /api/auth/me          -> current user (protected)
    POST /api/predict          -> prediction from image + metadata
                                 (authenticated + rate limited)
    GET  /api/scans            -> current user's scans, newest first
    GET  /api/scans/{id}       -> one of the current user's scans
    GET  /api/scans/compare    -> two owned, same-region scans (validated)
    GET  /static/{folder}/{f}  -> owned scan / Grad-CAM image (private)

The model is loaded once at startup.

Prediction flow:
    upload -> validate -> model prediction -> risk/uncertainty ->
    Grad-CAM -> save original image -> save scan record -> respond

A scan record is only created when the whole flow succeeds. If saving
fails the API returns a safe server error and never pretends the scan
was saved. Every scan is owned by the authenticated user.

Security:
    - JWT secret / CORS origins come from the environment only
    - signup, login, prediction and static images are rate limited
    - scan + Grad-CAM images are served only to their owner
    - error responses never expose stack traces, paths, or secrets

Error mapping:
    400 -> invalid input / image
    401 -> missing / invalid / expired token, bad credentials
    404 -> scan not found (or owned by another user)
    422 -> validation error
    429 -> rate limited
    500 -> unexpected inference / server / storage error
"""

from contextlib import asynccontextmanager
from datetime import datetime, timezone
from logging import getLogger
from pathlib import Path

from fastapi import (
    Depends,
    FastAPI,
    File,
    Form,
    HTTPException,
    Request,
    UploadFile,
)
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy.orm import Session

from app import config
from app.core.deps import get_current_user
from app.core.mappings import (
    GENDER_VALUES,
    get_canonical_regions,
)
from app.core.model import get_model
from app.core.ratelimit import check_rate_limit, client_ip
from app.core.validation import (
    read_upload_limited,
    sanitize_filename,
    validate_age,
    validate_gender,
    validate_image_bytes,
    validate_region,
)
from app.db import get_db, init_db
from app.models import User
from app.schemas import (
    CompareScansResponse,
    GradCAMInfo,
    ImageInfo,
    LoginRequest,
    LoginResponse,
    MetaResponse,
    PatientInfo,
    PredictionInfo,
    PredictionResponse,
    ScanResponse,
    ScansListResponse,
    SignupRequest,
    TopPrediction,
    UncertaintyInfo,
    UserResponse,
)
from app.services.auth_service import (
    authenticate_user,
    create_user,
    issue_token,
    serialize_user,
    validate_signup_fields,
)
from app.services.gradcam_service import generate_gradcam
from app.services.predictor import predict
from app.services.risk_service import assess
from app.services.scan_service import (
    create_scan,
    find_asset_owner,
    get_scan as get_scan_record,
    list_scans as list_scan_records,
    save_uploaded_image,
)

# Ensure the static storage directory exists before serving it.
config.STORAGE_DIR.mkdir(parents=True, exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables (idempotent — existing data survives restarts)
    # and apply the lightweight user_id migration for legacy scans.
    init_db()

    # Load the model once at startup.
    get_model()
    yield


app = FastAPI(
    title="DermaAI Backend",
    description="Multimodal skin lesion classification API.",
    version="0.7.0",
    lifespan=lifespan,
)

# ============================================================
# Error handling: production responses never expose stack traces,
# filesystem paths, database internals, or secrets.
# ============================================================

_logger = getLogger("dermaai.backend")


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
):
    _logger.warning(
        "Request validation failed on %s %s: %s",
        request.method,
        request.url.path,
        exc.errors(),
    )
    return JSONResponse(
        status_code=422,
        content={"detail": "Invalid request."},
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    # Log the full traceback server-side only; the client gets a safe,
    # generic message with no internal details.
    _logger.exception(
        "Unhandled error on %s %s",
        request.method,
        request.url.path,
    )
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error."},
    )


# ============================================================
# CORS: explicit allowed origins only (never "*").
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# ============================================================
# Private static images
#
# Scan and Grad-CAM images are served ONLY to the owning user. The
# route validates the auth token and verifies ownership of the file
# against the database, and never serves arbitrary paths.
# ============================================================

@app.get("/static/{path:path}")
def static_asset(
    path: str,
    request: Request,
    user: "User" = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    check_rate_limit("static", client_ip(request))

    parts = path.split("/")

    if len(parts) != 2 or parts[0] not in ("scans", "gradcam"):
        raise HTTPException(status_code=404, detail="Not found.")

    filename = parts[1]

    if not filename or Path(filename).name != filename:
        raise HTTPException(status_code=404, detail="Not found.")

    owner_id = find_asset_owner(db, parts[0], filename)

    if owner_id is None or owner_id != user.id:
        # Never reveal whether the file exists or who owns it.
        raise HTTPException(status_code=404, detail="Not found.")

    directory = (
        config.SCANS_DIR if parts[0] == "scans" else config.GRADCAM_DIR
    )

    file_path = directory / filename

    if not file_path.is_file():
        raise HTTPException(status_code=404, detail="Not found.")

    return FileResponse(str(file_path))


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/meta", response_model=MetaResponse)
def meta():
    return MetaResponse(
        classNames=config.CLASS_NAMES,
        genderValues=GENDER_VALUES,
        regions=get_canonical_regions(),
    )


# ============================================================
# Authentication
# ============================================================

@app.post("/api/auth/signup", response_model=UserResponse)
def signup(payload: SignupRequest, request: Request):
    check_rate_limit("signup", client_ip(request))

    validate_signup_fields(
        name=payload.name,
        email=payload.email,
        password=payload.password,
        preferred_language=payload.preferredLanguage,
    )

    user = create_user(
        name=payload.name,
        email=payload.email,
        password=payload.password,
        preferred_language=payload.preferredLanguage,
    )

    return UserResponse(**serialize_user(user))


@app.post("/api/auth/login", response_model=LoginResponse)
def login(payload: LoginRequest, request: Request):
    # Limit both attempts from one IP and attempts against one account.
    email = str(payload.email or "").strip().lower()
    check_rate_limit("login", client_ip(request), email)

    user = authenticate_user(
        email=payload.email,
        password=payload.password,
    )

    return LoginResponse(
        token=issue_token(user),
        user=UserResponse(**serialize_user(user)),
    )


@app.get("/api/auth/me", response_model=UserResponse)
def me(user: "User" = Depends(get_current_user)):
    return UserResponse(**serialize_user(user))


@app.post("/api/predict", response_model=PredictionResponse)
async def prediction(
    file: UploadFile | None = File(None),
    age: str = Form(...),
    gender: str = Form(...),
    region: str = Form(...),
    user: "User" = Depends(get_current_user),
    request: Request = None,
):
    # Prediction runs the model: limit abuse per IP and per account.
    check_rate_limit("predict", client_ip(request), f"user:{user.id}")

    try:
        # Streaming read with a hard cap bounds memory usage.
        image_bytes = (
            await read_upload_limited(file) if file else b""
        )

        image_bytes = validate_image_bytes(
            image_bytes=image_bytes,
            filename=file.filename if file else "",
        )

        age_value = validate_age(age)
        gender_value = validate_gender(gender)
        region_value = validate_region(region)

        prediction = predict(
            image_bytes=image_bytes,
            age=age_value,
            gender=gender_value,
            region=region_value,
        )

        top_predictions = [
            TopPrediction(
                className=item["className"],
                confidence=item["confidence"],
                probability=item["confidence"],
            )
            for item in prediction["topPredictions"]
        ]

        predicted_class = config.CLASS_NAMES.index(
            prediction["className"]
        )

        # Risk & uncertainty decision layer (separate from model).
        risk = assess(prediction)

        # Grad-CAM for the ACTUAL predicted class.
        # The prediction must still succeed if Grad-CAM fails.
        try:
            gradcam_result = generate_gradcam(
                image_bytes=image_bytes,
                age=age_value,
                gender=gender_value,
                region=region_value,
                predicted_class=predicted_class,
            )

            gradcam = GradCAMInfo(
                available=True,
                imageUrl=gradcam_result["imageUrl"],
            )

        except Exception:
            gradcam = GradCAMInfo(
                available=False,
                imageUrl=None,
            )

        # --------------------------------------------------------
        # Persist: save the original image, then the scan record.
        # A failed save must never look like a successful scan.
        # --------------------------------------------------------

        saved_image = None

        try:
            saved_image = save_uploaded_image(image_bytes)

            scan_id = create_scan(
                user_id=user.id,
                image_filename=saved_image["filename"],
                image_url=saved_image["imageUrl"],
                gradcam_url=gradcam.imageUrl,
                age=age_value,
                gender=gender_value,
                region=region_value,
                prediction_class=prediction["className"],
                confidence=prediction["confidence"],
                risk_level=risk["riskLevel"],
                is_uncertain=risk["isUncertain"],
                top_predictions=[
                    item.model_dump() for item in top_predictions
                ],
                uncertainty_message=risk["message"],
            )

        except Exception:
            # Remove the image file we just wrote so a failed scan
            # leaves no orphaned file behind.
            if saved_image is not None:
                try:
                    (config.SCANS_DIR / saved_image["filename"]).unlink(
                        missing_ok=True
                    )
                except Exception:
                    pass

            raise

        return PredictionResponse(
            scanId=scan_id,
            isDemo=False,
            patient=PatientInfo(
                age=age_value,
                gender=gender_value,
                region=region_value,
            ),
            image=ImageInfo(
                fileName=sanitize_filename(
                    file.filename if file else ""
                ),
                analyzedAt=datetime.now(
                    timezone.utc
                ).isoformat(),
            ),
            prediction=PredictionInfo(
                className=prediction["className"],
                confidence=prediction["confidence"],
                riskLevel=risk["riskLevel"],
                topPredictions=top_predictions,
            ),
            gradcam=gradcam,
            uncertainty=UncertaintyInfo(
                isUncertain=risk["isUncertain"],
                message=risk["message"],
            ),
            guidance=None,
            nextSteps=None,
        )

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail=(
                "Unexpected error while analyzing the image. "
                "Please try again."
            ),
        )


@app.get("/api/scans", response_model=ScansListResponse)
def scans(
    user: "User" = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Return ONLY the authenticated user's scans, newest first.

    Scans are always scoped to the logged-in user.
    """
    return ScansListResponse(
        scans=list_scan_records(db, user.id)
    )


@app.get("/api/scans/compare", response_model=CompareScansResponse)
def compare_scans(
    first_id: int,
    second_id: int,
    user: "User" = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Return two scans for comparison, with strict validation:

        - both scans must belong to the authenticated user
        - the two scans must be different
        - both scans must be from the same body region

    Invalid combinations are rejected safely:
        400 -> same scan requested twice, or different body regions
        404 -> either scan is missing or belongs to another user
        401 -> missing / invalid / expired token

    The response is ordered newest-first (scans[0] = newer) so the
    frontend always shows current = newest, previous = older.
    """
    if first_id == second_id:
        raise HTTPException(
            status_code=400,
            detail="Choose two different scans to compare.",
        )

    first = get_scan_record(db, first_id, user.id)
    second = get_scan_record(db, second_id, user.id)

    if first is None or second is None:
        raise HTTPException(
            status_code=404,
            detail="Scan not found.",
        )

    if first["patient"]["region"] != second["patient"]["region"]:
        raise HTTPException(
            status_code=400,
            detail=(
                "Both scans must be from the same body region "
                "to compare them."
            ),
        )

    ordered = sorted(
        [first, second],
        key=lambda scan: scan["createdAt"],
        reverse=True,
    )

    return CompareScansResponse(scans=ordered)


@app.get("/api/scans/{scan_id}", response_model=ScanResponse)
def scan_detail(
    scan_id: int,
    user: "User" = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Return one scan, but only if it belongs to the authenticated user.

    If the scan is missing OR owned by another user, a 404 is
    returned so the existence of other users' scans is never
    revealed.
    """
    record = get_scan_record(db, scan_id, user.id)

    if record is None:
        raise HTTPException(
            status_code=404,
            detail="Scan not found.",
        )

    return ScanResponse(**record)