"""Pydantic schemas for the backend API."""

from pydantic import BaseModel


class TopPrediction(BaseModel):
    className: str
    confidence: float
    probability: float


class PredictionInfo(BaseModel):
    className: str
    confidence: float
    riskLevel: str
    topPredictions: list[TopPrediction]


class UncertaintyInfo(BaseModel):
    isUncertain: bool
    message: str


class PatientInfo(BaseModel):
    age: float
    gender: str
    region: str


class ImageInfo(BaseModel):
    fileName: str
    analyzedAt: str


class GradCAMInfo(BaseModel):
    available: bool
    imageUrl: str | None = None


class PredictionResponse(BaseModel):
    scanId: int
    isDemo: bool
    patient: PatientInfo
    image: ImageInfo
    prediction: PredictionInfo
    gradcam: GradCAMInfo
    uncertainty: UncertaintyInfo

    # Fields the frontend currently expects but which are not
    # implemented yet. Returned as null rather than invented.
    guidance: None = None
    nextSteps: None = None
    disclaimer: str = (
        "AI-assisted preliminary information. "
        "This is not a medical diagnosis."
    )


class ScanImageInfo(BaseModel):
    fileName: str
    imageUrl: str


class ScanGradCAMInfo(BaseModel):
    available: bool
    imageUrl: str | None = None


class ScanUncertaintyInfo(BaseModel):
    isUncertain: bool
    message: str


class ScanResponse(BaseModel):
    scanId: int
    createdAt: str
    image: ScanImageInfo
    gradcam: ScanGradCAMInfo
    patient: PatientInfo
    prediction: PredictionInfo
    uncertainty: ScanUncertaintyInfo


class ScansListResponse(BaseModel):
    scans: list[ScanResponse]


class CompareScansResponse(BaseModel):
    """Two owned, same-region scans for comparison (newest first)."""
    scans: list[ScanResponse]


class MetaResponse(BaseModel):
    classNames: list[str]
    genderValues: list[str]
    regions: list[str]


# ============================================================
# Authentication
# ============================================================

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    preferredLanguage: str = "en"


class LoginRequest(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    preferredLanguage: str
    createdAt: str


class LoginResponse(BaseModel):
    token: str
    user: UserResponse