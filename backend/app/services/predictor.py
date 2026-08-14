"""
Reusable prediction service.

Accepts raw image bytes plus patient metadata (age, gender,
region), applies the existing ImageNet preprocessing and runs a
single read-only forward pass.

Returns:
    {
        "className": str,
        "confidence": float,
        "topPredictions": [{"className": str, "confidence": float}]
    }
"""

from io import BytesIO

import torch
from PIL import Image
from torchvision import transforms

from app import config
from app.core.mappings import (
    encode_region,
    normalize_gender,
)
from app.core.model import get_model

# ============================================================
# Image Transform (identical to existing validation pipeline)
# ============================================================

_TRANSFORM = transforms.Compose(
    [
        transforms.Resize(config.IMAGE_SIZE),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=config.IMAGENET_MEAN,
            std=config.IMAGENET_STD,
        ),
    ]
)

TOP_K = 3


def predict(
    image_bytes: bytes,
    age: float,
    gender: str,
    region: str,
) -> dict:
    """
    Run inference on an in-memory image.

    Args:
        image_bytes: Raw image file bytes.
        age: Patient age as a float.
        gender: Raw gender string (Male/Female/Unknown).
        region: Raw region string (case-sensitive canonical).

    Returns:
        Prediction result dict.
    """
    # --------------------------------------------------------
    # Load image bytes -> PIL RGB
    # --------------------------------------------------------

    with Image.open(BytesIO(image_bytes)) as image:
        image = image.convert("RGB")

    # --------------------------------------------------------
    # Preprocess
    # --------------------------------------------------------

    image_tensor = _TRANSFORM(image).unsqueeze(0)

    # --------------------------------------------------------
    # Metadata tensors
    # --------------------------------------------------------

    age_tensor = torch.tensor(
        [float(age)],
        dtype=torch.float32,
    )

    gender_tensor = torch.tensor(
        [normalize_gender(gender)],
        dtype=torch.long,
    )

    region_tensor = torch.tensor(
        [encode_region(region)],
        dtype=torch.long,
    )

    # --------------------------------------------------------
    # Inference (read-only)
    # --------------------------------------------------------

    model = get_model()

    with torch.no_grad():
        outputs = model(
            image_tensor,
            age_tensor,
            gender_tensor,
            region_tensor,
        )

        probabilities = torch.softmax(
            outputs,
            dim=1,
        )

    # --------------------------------------------------------
    # Top prediction
    # --------------------------------------------------------

    top_probabilities, top_indices = torch.topk(
        probabilities,
        k=min(TOP_K, probabilities.size(1)),
        dim=1,
    )

    top_predictions = [
        {
            "className": config.CLASS_NAMES[
                index.item()
            ],
            "confidence": probability.item(),
        }
        for probability, index in zip(
            top_probabilities[0],
            top_indices[0],
        )
    ]

    return {
        "className": top_predictions[0]["className"],
        "confidence": top_predictions[0]["confidence"],
        "topPredictions": top_predictions,
    }