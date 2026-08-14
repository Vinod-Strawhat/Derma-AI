"""
Request validation for the prediction API.

Converts raw multipart fields into validated values before any
inference runs. Every error is a user-safe message — no filesystem
paths, stack traces, checkpoint paths, or internal errors are
exposed.
"""

import math
import re
from io import BytesIO
from pathlib import Path

from fastapi import HTTPException
from PIL import Image

from app import config
from app.core.mappings import (
    GENDER_MAPPING,
    get_region_mapping,
)

# Guard against decompression-bomb / extremely large image uploads.
# PIL raises DecompressionBombError during load() above this limit,
# which we translate into a user-safe 400 below.
Image.MAX_IMAGE_PIXELS = config.MAX_IMAGE_PIXELS

# Allowed characters for an echoed client filename. Anything else is
# replaced by the safe default.
_SAFE_FILENAME_RE = re.compile(r"^[A-Za-z0-9._ -]+$")

_MAX_FILENAME_LENGTH = 120

_UPLOAD_CHUNK_SIZE = 64 * 1024


async def read_upload_limited(file) -> bytes:
    """
    Read a multipart file with a hard cap on total size.

    Streaming in chunks bounds memory usage so an oversized upload is
    rejected before it is fully buffered.
    """
    total = 0
    chunks: list[bytes] = []

    while True:
        chunk = await file.read(_UPLOAD_CHUNK_SIZE)
        if not chunk:
            break

        total += len(chunk)

        if total > config.MAX_IMAGE_BYTES:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Image file is too large. "
                    f"Maximum size is "
                    f"{config.MAX_IMAGE_BYTES // (1024 * 1024)} MB."
                ),
            )

        chunks.append(chunk)

    return b"".join(chunks)


def validate_image_bytes(
    image_bytes: bytes,
    filename: str = "",
) -> bytes:
    """
    Validate uploaded image bytes.

    Checks size, that the content is a real image, and that the actual
    decoded format is one of the supported formats. Returns the
    validated bytes unchanged, or raises HTTPException with a
    user-safe 400 message.
    """
    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="Image file is required.",
        )

    if len(image_bytes) > config.MAX_IMAGE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=(
                "Image file is too large. "
                f"Maximum size is "
                f"{config.MAX_IMAGE_BYTES // (1024 * 1024)} MB."
            ),
        )

    try:
        with Image.open(BytesIO(image_bytes)) as image:
            image.load()

            image_format = (image.format or "").upper()

            if image_format not in config.SUPPORTED_IMAGE_FORMATS:
                raise HTTPException(
                    status_code=400,
                    detail=(
                        "Unsupported image format. Allowed formats: "
                        "JPEG, PNG, WEBP, BMP."
                    ),
                )

            image.convert("RGB")
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Unsupported or corrupt image file.",
        )

    return image_bytes


def validate_age(age_text: str) -> float:
    """
    Validate the age form field.

    Returns the age as a float, or raises HTTPException with a
    user-safe 422 message.
    """
    if age_text is None or str(age_text).strip() == "":
        raise HTTPException(
            status_code=422,
            detail="Age is required.",
        )

    try:
        age = float(str(age_text).strip())
    except (TypeError, ValueError):
        raise HTTPException(
            status_code=422,
            detail="Age must be a numeric value.",
        )

    if not math.isfinite(age):
        raise HTTPException(
            status_code=422,
            detail="Age must be a finite number.",
        )

    if age < 0:
        raise HTTPException(
            status_code=422,
            detail="Age must not be negative.",
        )

    if age > config.MAX_AGE:
        raise HTTPException(
            status_code=422,
            detail=(
                "Age seems unreasonable. "
                f"Maximum allowed is {config.MAX_AGE}."
            ),
        )

    return age


def validate_gender(gender_text: str) -> str:
    """
    Validate the gender form field.

    Returns the canonical gender string, or raises HTTPException
    with a user-safe 422 message.
    """
    if gender_text is None or str(gender_text).strip() == "":
        raise HTTPException(
            status_code=422,
            detail="Gender is required.",
        )

    canonical = str(gender_text).strip().capitalize()

    if canonical not in GENDER_MAPPING:
        raise HTTPException(
            status_code=422,
            detail="Gender must be one of: Male, Female, Unknown.",
        )

    return canonical


def validate_region(region_text: str) -> str:
    """
    Validate the region form field.

    The region must exist verbatim (case-sensitive) in the canonical
    region mapping built from master_metadata.csv. No values are
    invented or silently remapped.

    Returns the canonical region string, or raises HTTPException
    with a user-safe 422 message.
    """
    if region_text is None or str(region_text).strip() == "":
        raise HTTPException(
            status_code=422,
            detail="Region is required.",
        )

    canonical = str(region_text).strip()

    if canonical not in get_region_mapping():
        raise HTTPException(
            status_code=422,
            detail="Region must be one of the supported body regions.",
        )

    return canonical


def sanitize_filename(filename: str) -> str:
    """
    Sanitize an uploaded client filename.

    Path components are stripped (both '/' and '\\'), the length is
    capped, and any remaining unsafe characters are replaced by a safe
    default so the raw client value is never echoed back or used in
    path construction. Stored files ALWAYS use backend-generated
    unique names, never this value.
    """
    name = Path(str(filename or "").replace("\\", "/")).name
    name = name[:_MAX_FILENAME_LENGTH]

    if (
        not name
        or name in (".", "..")
        or not _SAFE_FILENAME_RE.match(name)
    ):
        return "upload"

    return name