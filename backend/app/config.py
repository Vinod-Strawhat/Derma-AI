"""
Backend configuration.

Centralizes paths and constants used by the FastAPI backend.
The model itself is NOT modified here; only loaded from the
existing checkpoint.
"""

import os
import secrets
from pathlib import Path

from dotenv import load_dotenv

# Load backend/.env for local development. Environment variables set
# in the shell always take precedence over the .env file.
_BACKEND_ROOT_ENV = Path(__file__).resolve().parents[1]
load_dotenv(_BACKEND_ROOT_ENV / ".env")

# ============================================================
# Environment / deployment mode
# ============================================================

# DERMA_APP_ENV: "development" (default) or "production".
# In production the backend refuses to start unless DERMA_JWT_SECRET
# and CORS_ORIGINS are explicitly provided.
APP_ENV = os.environ.get("DERMA_APP_ENV", "development").strip().lower()

IS_PRODUCTION = APP_ENV == "production"

# ============================================================
# Paths
# ============================================================

# backend/app/config.py -> backend -> project root
PROJECT_ROOT = Path(__file__).resolve().parents[2]

METADATA_PATH = (
    PROJECT_ROOT
    / "datasets"
    / "merged"
    / "master_metadata.csv"
)

CHECKPOINT_PATH = (
    PROJECT_ROOT
    / "checkpoints"
    / "best_multimodal_model.pth"
)

# ============================================================
# Model Architecture (must match existing training config)
# ============================================================

NUM_CLASSES = 8
NUM_REGIONS = 50
NUM_GENDERS = 3

# ============================================================
# Image Preprocessing (must match existing training config)
# ============================================================

IMAGE_SIZE = (224, 224)

IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]

# ============================================================
# Classes
# ============================================================

CLASS_NAMES = [
    "Actinic Keratosis",
    "Basal Cell Carcinoma",
    "Benign Keratosis",
    "Dermatofibroma",
    "Melanoma",
    "Melanocytic Nevus",
    "Squamous Cell Carcinoma",
    "Vascular Lesion",
]

# ============================================================
# Validation Limits
# ============================================================

# Reasonable upload limit (10 MB).
MAX_IMAGE_BYTES = 10 * 1024 * 1024

# Decompression-bomb guard for image validation (pixels).
MAX_IMAGE_PIXELS = 50_000_000

# Image formats we accept for upload. A file is only accepted when the
# actual decoded content reports one of these formats.
SUPPORTED_IMAGE_FORMATS = {"JPEG", "PNG", "WEBP", "BMP"}

# Upper bound for a plausible patient age.
MAX_AGE = 120

# ============================================================
# Storage (temporary, backend-only)
# ============================================================

# backend/app/config.py -> backend
BACKEND_ROOT = Path(__file__).resolve().parents[1]

STORAGE_DIR = BACKEND_ROOT / "storage"

GRADCAM_DIR = STORAGE_DIR / "gradcam"

SCANS_DIR = STORAGE_DIR / "scans"

# ============================================================
# Database (SQLite for local development)
# ============================================================

# backend/data/dermaai.db — SQLite is used for local development.
# A production deployment would swap this URL for PostgreSQL/MySQL.
DATA_DIR = BACKEND_ROOT / "data"

# Optional override for tests / deployments to place the SQLite file
# elsewhere (e.g. DERMA_DB_PATH=/var/lib/dermaai/dermaai.db).
DB_PATH_OVERRIDE = os.environ.get("DERMA_DB_PATH")

if DB_PATH_OVERRIDE:
    DATABASE_PATH = Path(DB_PATH_OVERRIDE)
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
else:
    DATABASE_PATH = DATA_DIR / "dermaai.db"

DATABASE_URL = f"sqlite:///{DATABASE_PATH.as_posix()}"

# ============================================================
# Authentication (JWT)
# ============================================================

# JWT signing secret. Read from the environment — never hardcoded.
#
# DERMA_JWT_SECRET: REQUIRED in production (startup fails without it)
# and must be at least 32 characters. For local development a random
# secret is generated on each process start when the variable is
# missing, which means tokens issued by one server run will not be
# valid after a restart. Set the environment variable to keep tokens
# valid across restarts and to craft tokens in tests.
JWT_SECRET_KEY = os.environ.get("DERMA_JWT_SECRET") or (
    None if IS_PRODUCTION else secrets.token_hex(32)
)

if not JWT_SECRET_KEY:
    raise RuntimeError(
        "DERMA_JWT_SECRET must be set in production. "
        "Generate one with: python -c \"import secrets; "
        "print(secrets.token_hex(32))\""
    )

if len(JWT_SECRET_KEY) < 32:
    raise RuntimeError(
        "DERMA_JWT_SECRET must be at least 32 characters long."
    )

JWT_ALGORITHM = os.environ.get("DERMA_JWT_ALGORITHM", "HS256")

JWT_EXPIRE_MINUTES = int(
    os.environ.get("DERMA_JWT_EXPIRE_MINUTES", "1440")
)  # 24h default

# ============================================================
# CORS
# ============================================================

# Allowed browser origins. Provide as a comma-separated list in the
# CORS_ORIGINS environment variable (e.g. "https://app.example.com,
# https://admin.example.com"). Required in production. A wildcard "*"
# is always rejected so credentials-enabled flows stay safe.
DEFAULT_CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

_CORS_RAW = os.environ.get("CORS_ORIGINS", "").strip()

if _CORS_RAW:
    CORS_ORIGINS = [
        origin.strip()
        for origin in _CORS_RAW.split(",")
        if origin.strip()
    ]

    if "*" in CORS_ORIGINS:
        raise RuntimeError(
            "CORS_ORIGINS must not contain a wildcard '*'. "
            "List the exact origins that may call this API."
        )
else:
    if IS_PRODUCTION:
        raise RuntimeError(
            "CORS_ORIGINS is required in production. Provide a "
            "comma-separated list of allowed browser origins."
        )

    CORS_ORIGINS = DEFAULT_CORS_ORIGINS

# ============================================================
# Password Hashing (PBKDF2-HMAC-SHA256)
# ============================================================

PASSWORD_ITERATIONS = int(
    os.environ.get("DERMA_PBKDF2_ITERATIONS", "600000")
)

PASSWORD_MIN_LENGTH = 8

# ============================================================
# Rate limiting (lightweight, in-memory)
# ============================================================

# Enables per-IP (and per-account for login) fixed-window limiting for
# signup / login / predict / static image access. Suitable for a
# single-process development server; a production deployment behind
# multiple workers should move this to a shared store.
RATE_LIMIT_ENABLED = os.environ.get("DERMA_RATE_LIMIT", "1").lower() not in (
    "0",
    "false",
    "off",
)

RATE_LIMIT_WINDOW_SECONDS = int(
    os.environ.get("DERMA_RATE_WINDOW", "60")
)

RATE_LIMIT_SIGNUP = int(os.environ.get("DERMA_RATE_SIGNUP", "10"))

RATE_LIMIT_LOGIN = int(os.environ.get("DERMA_RATE_LOGIN", "10"))

RATE_LIMIT_PREDICT = int(os.environ.get("DERMA_RATE_PREDICT", "15"))

RATE_LIMIT_STATIC = int(os.environ.get("DERMA_RATE_STATIC", "120"))

# When "1", the first X-Forwarded-For value is trusted as the client
# IP (required when running behind a reverse proxy). Defaults to off.
TRUST_PROXY = os.environ.get("DERMA_TRUST_PROXY", "0").lower() in (
    "1",
    "true",
    "yes",
)

# ============================================================
# Authentication Validation
# ============================================================

# Supported UI languages for preferredLanguage.
SUPPORTED_LANGUAGES = {"en", "kn", "te", "ta", "hi"}

# ============================================================
# Risk / Uncertainty (preliminary, configurable)
# ============================================================

# Heuristic uncertainty thresholds.
# These are NOT clinically validated thresholds — they are
# transparent, easily changeable heuristics for flagging results
# where AI confidence is insufficient.
#
# A result is treated as uncertain when EITHER:
#   - top-1 confidence < UNCERTAINTY_MIN_CONFIDENCE, or
#   - (top-1 - top-2) margin < UNCERTAINTY_MIN_MARGIN
UNCERTAINTY_MIN_CONFIDENCE = 0.60
UNCERTAINTY_MIN_MARGIN = 0.10

# Preliminary risk category per predicted class.
#
# These categories are for display only and are NOT clinically
# validated risk thresholds. They are a clearly documented,
# configurable starting point so the API can flag a predicted
# class with a preliminary "low | medium | high" indicator.
# They do NOT constitute a medical diagnosis.
CLASS_RISK_CATEGORY = {
    "Actinic Keratosis": "medium",
    "Basal Cell Carcinoma": "medium",
    "Benign Keratosis": "low",
    "Dermatofibroma": "low",
    "Melanoma": "high",
    "Melanocytic Nevus": "low",
    "Squamous Cell Carcinoma": "high",
    "Vascular Lesion": "low",
}

# ============================================================
# Device (CPU-safe loading)
# ============================================================

DEVICE = "cpu"