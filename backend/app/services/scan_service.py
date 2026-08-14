"""
Scan persistence service.

Responsibilities:
    - saving the original uploaded image under backend/storage/scans
    - creating / reading Scan database records
    - serializing records for the API

Safety:
    - only safe relative URLs (e.g. "/static/scans/scan_x.jpg") are
      ever returned; absolute filesystem paths are never exposed
    - no database internals leak into API responses
"""

import hashlib
import json
import time
from io import BytesIO
from pathlib import Path

from PIL import Image

from app import config
from app.db import SessionLocal
from app.models import Scan

# ============================================================
# Image Storage
# ============================================================

_FORMAT_EXTENSION = {
    "JPEG": ".jpg",
    "PNG": ".png",
    "WEBP": ".webp",
    "BMP": ".bmp",
}


def _unique_stem(prefix: str) -> str:
    digest = hashlib.sha256(
        time.time_ns().to_bytes(8, "big")
    ).hexdigest()[:12]

    return f"{prefix}_{digest}"


def _detect_extension(image_bytes: bytes) -> str:
    """Derive the correct extension from the actual image content."""
    try:
        with Image.open(BytesIO(image_bytes)) as image:
            return _FORMAT_EXTENSION.get(image.format, ".jpg")
    except Exception:
        return ".jpg"


def save_uploaded_image(image_bytes: bytes) -> dict:
    """
    Save the original uploaded image under backend/storage/scans.

    Args:
        image_bytes: The validated image bytes (same bytes used for
            the prediction).

    Returns:
        {
            "filename": str,     # e.g. "scan_abc123.jpg"
            "relativePath": str,  # e.g. "scans/scan_abc123.jpg"
            "imageUrl": str,      # e.g. "/static/scans/scan_abc123.jpg"
        }
    """
    config.SCANS_DIR.mkdir(parents=True, exist_ok=True)

    stem = _unique_stem("scan")
    extension = _detect_extension(image_bytes)
    filename = f"{stem}{extension}"
    image_path = config.SCANS_DIR / filename

    with open(image_path, "wb") as handle:
        handle.write(image_bytes)

    relative_path = (Path("scans") / filename).as_posix()

    return {
        "filename": filename,
        "relativePath": relative_path,
        "imageUrl": f"/static/{relative_path}",
    }


# ============================================================
# Serialization
# ============================================================

def serialize_scan(scan: Scan) -> dict:
    """Serialize a Scan row into a safe API-shaped dict."""
    try:
        top_predictions = json.loads(scan.top_predictions or "[]")
    except (TypeError, ValueError):
        top_predictions = []

    return {
        "scanId": scan.id,
        "createdAt": scan.created_at.isoformat(),
        "image": {
            "fileName": scan.image_filename,
            "imageUrl": scan.image_url,
        },
        "gradcam": {
            "available": bool(scan.gradcam_url),
            "imageUrl": scan.gradcam_url,
        },
        "patient": {
            "age": scan.age,
            "gender": scan.gender,
            "region": scan.region,
        },
        "prediction": {
            "className": scan.prediction,
            "confidence": scan.confidence,
            "riskLevel": scan.risk_level,
            "topPredictions": top_predictions,
        },
        "uncertainty": {
            "isUncertain": scan.is_uncertain,
            "message": scan.uncertainty_message,
        },
    }


# ============================================================
# CRUD
# ============================================================

def create_scan(
    *,
    user_id: int,
    image_filename: str,
    image_url: str,
    gradcam_url: str | None,
    age: float,
    gender: str,
    region: str,
    prediction_class: str,
    confidence: float,
    risk_level: str,
    is_uncertain: bool,
    top_predictions: list,
    uncertainty_message: str,
) -> int:
    """
    Persist one successful scan (owned by user_id) and return its id.

    Raises on failure so the caller never reports a saved scan when
    the write actually failed.
    """
    db = SessionLocal()
    try:
        scan = Scan(
            user_id=user_id,
            image_filename=image_filename,
            image_url=image_url,
            gradcam_url=gradcam_url,
            age=age,
            gender=gender,
            region=region,
            prediction=prediction_class,
            confidence=confidence,
            risk_level=risk_level,
            is_uncertain=is_uncertain,
            top_predictions=json.dumps(top_predictions),
            uncertainty_message=uncertainty_message,
        )
        db.add(scan)
        db.commit()
        db.refresh(scan)
        return scan.id
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def list_scans(db, user_id: int, limit: int = 100) -> list:
    """Return the authenticated user's scans, newest first."""
    records = (
        db.query(Scan)
        .filter(Scan.user_id == user_id)
        .order_by(Scan.created_at.desc(), Scan.id.desc())
        .limit(limit)
        .all()
    )

    return [serialize_scan(record) for record in records]


def get_scan(db, scan_id: int, user_id: int):
    """
    Return one scan, but ONLY if it belongs to user_id.

    Returns None both when the scan does not exist and when it
    belongs to another user, so the API never reveals that another
    user's scan exists.
    """
    record = db.get(Scan, scan_id)

    if record is None or record.user_id != user_id:
        return None

    return serialize_scan(record)


def find_asset_owner(db, folder: str, filename: str) -> int | None:
    """
    Return the user_id that owns a stored image filename, or None.

    Used by the authenticated /static route to make scan and Grad-CAM
    images private: a request is only served when the token user owns
    the file. Legacy (unowned) scans resolve to None.
    """
    if folder == "scans":
        record = (
            db.query(Scan)
            .filter(Scan.image_filename == filename)
            .first()
        )
    elif folder == "gradcam":
        record = (
            db.query(Scan)
            .filter(Scan.gradcam_url == f"/static/gradcam/{filename}")
            .first()
        )
    else:
        return None

    if record is None:
        return None

    return record.user_id