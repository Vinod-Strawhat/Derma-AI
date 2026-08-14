"""
Backend Grad-CAM service.

Reuses the EXISTING Grad-CAM algorithm from Phase 10
(src/explainability/gradcam.py):

    - target layer      : last Conv2d in the model
    - forward hook      : captures activations
    - backward hook     : captures gradients
    - backward pass     : on the ACTUAL predicted class
    - CAM               : global-average-pooled gradient weights
                          weighted by activations, ReLU
    - heatmap           : normalized CAM resized to original,
                          JET color map
    - overlay           : transparent JET blend on the original

The existing file is a standalone script (file-path based, loads its
own model, uses a 2-value gender map and fixed output directory), so
it cannot be invoked as-is for in-memory requests. This service keeps
the exact same algorithm but runs it on the already-loaded backend
model, uses the same gender/region/preprocessing as the prediction,
and stores the visualization temporarily under backend/storage.

The Grad-CAM is generated for the class that was actually predicted.
"""

import hashlib
import time
from io import BytesIO
from pathlib import Path

import cv2
import numpy as np
import torch
from PIL import Image

from app import config
from app.core.mappings import (
    encode_region,
    normalize_gender,
)
from app.core.model import get_model
from app.services.predictor import _TRANSFORM

# ============================================================
# Target Layer
# ============================================================

# Cached target layer info (same selection logic as existing code).
_target_layer = None
_target_layer_name = None


def _find_target_layer(model):
    """
    Find the last Conv2d layer, exactly like the existing
    Phase 10 implementation.
    """
    global _target_layer, _target_layer_name

    if _target_layer is None:
        for name, module in model.named_modules():
            if isinstance(module, torch.nn.Conv2d):
                _target_layer = module
                _target_layer_name = name

        if _target_layer is None:
            raise RuntimeError(
                "No Conv2d layer found in the model."
            )

    return _target_layer, _target_layer_name


def _unique_stem() -> str:
    """Create a unique filename stem for the visualization."""
    digest = hashlib.sha256(
        time.time_ns().to_bytes(8, "big")
    ).hexdigest()[:10]

    return f"gradcam_{digest}"


# ============================================================
# Grad-CAM Generation
# ============================================================

def generate_gradcam(
    image_bytes: bytes,
    age: float,
    gender: str,
    region: str,
    predicted_class: int,
):
    """
    Generate a Grad-CAM overlay for the predicted class.

    Args:
        image_bytes: The exact image bytes used for prediction.
        age: Patient age (float).
        gender: Canonical gender string.
        region: Canonical region string.
        predicted_class: Index of the ACTUAL predicted class.

    Returns:
        A dict with:
            "relativePath": str  (relative to backend storage)
            "imageUrl": str      (safe URL path)

    Raises on failure so the caller can degrade gracefully.
    """
    # --------------------------------------------------------
    # Load the original image (same bytes as prediction)
    # --------------------------------------------------------

    with Image.open(BytesIO(image_bytes)) as image:
        original_image = image.convert("RGB")

    original_array = np.array(original_image)

    # --------------------------------------------------------
    # Prepare tensors (identical to the prediction flow)
    # --------------------------------------------------------

    image_tensor = _TRANSFORM(original_image).unsqueeze(0)

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
    # Target layer + hooks
    # --------------------------------------------------------

    model = get_model()

    target_layer, layer_name = _find_target_layer(model)

    activations: dict = {}
    gradients: dict = {}

    def forward_hook(module, input, output):
        activations["value"] = output

    def backward_hook(module, grad_input, grad_output):
        gradients["value"] = grad_output[0]

    forward_handle = target_layer.register_forward_hook(
        forward_hook
    )
    backward_handle = target_layer.register_full_backward_hook(
        backward_hook
    )

    try:
        # ----------------------------------------------------
        # Forward pass
        # ----------------------------------------------------

        model.zero_grad()

        outputs = model(
            image_tensor,
            age_tensor,
            gender_tensor,
            region_tensor,
        )

        if "value" not in activations:
            raise RuntimeError(
                "Grad-CAM activations were not captured."
            )

        # ----------------------------------------------------
        # Backward pass on the actual predicted class
        # ----------------------------------------------------

        score = outputs[0, predicted_class]

        score.backward()

        if "value" not in gradients:
            raise RuntimeError(
                "Grad-CAM gradients were not captured."
            )

        # ----------------------------------------------------
        # Weighted activation map (same math as existing code)
        # ----------------------------------------------------

        activation = activations["value"].detach()
        gradient = gradients["value"].detach()

        weights = torch.mean(
            gradient,
            dim=(2, 3),
            keepdim=True,
        )

        cam = torch.sum(
            weights * activation,
            dim=1,
        )

        cam = torch.relu(cam)

        cam = cam[0].cpu().numpy()

        # ----------------------------------------------------
        # Normalize CAM
        # ----------------------------------------------------

        cam_min = cam.min()
        cam_max = cam.max()

        if cam_max - cam_min > 1e-8:
            cam = (cam - cam_min) / (cam_max - cam_min)
        else:
            cam = np.zeros_like(cam)

        # ----------------------------------------------------
        # Resize to the original image
        # ----------------------------------------------------

        height, width = original_array.shape[:2]

        cam = cv2.resize(
            cam,
            (width, height),
            interpolation=cv2.INTER_LINEAR,
        )

        # ----------------------------------------------------
        # Heatmap (JET)
        # ----------------------------------------------------

        heatmap_uint8 = np.uint8(255 * cam)

        heatmap = cv2.applyColorMap(
            heatmap_uint8,
            cv2.COLORMAP_JET,
        )

        # ----------------------------------------------------
        # Transparent overlay (same alpha logic as existing code)
        # ----------------------------------------------------

        original_bgr = cv2.cvtColor(
            original_array,
            cv2.COLOR_RGB2BGR,
        )

        alpha = np.clip(
            (cam - 0.20) / 0.80,
            0,
            1,
        )

        alpha = alpha * 0.30

        alpha = alpha[..., np.newaxis]

        original_float = original_bgr.astype(np.float32)
        heatmap_float = heatmap.astype(np.float32)

        overlay = (
            original_float * (1 - alpha)
            + heatmap_float * alpha
        )

        overlay = np.clip(
            overlay,
            0,
            255,
        ).astype(np.uint8)

        # ----------------------------------------------------
        # Save temporarily under backend storage
        # ----------------------------------------------------

        config.GRADCAM_DIR.mkdir(
            parents=True,
            exist_ok=True,
        )

        stem = _unique_stem()

        filename = f"{stem}.jpg"

        overlay_path = config.GRADCAM_DIR / filename

        cv2.imwrite(
            str(overlay_path),
            overlay,
        )

        relative_path = (
            Path("gradcam")
            / filename
        ).as_posix()

        image_url = f"/static/{relative_path}"

        return {
            "relativePath": relative_path,
            "imageUrl": image_url,
            "targetLayer": layer_name,
        }

    finally:
        forward_handle.remove()
        backward_handle.remove()