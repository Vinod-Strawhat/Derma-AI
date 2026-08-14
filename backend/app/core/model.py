"""
Model loading.

Loads the EXISTING MultimodalEfficientNet architecture and its
trained weights from checkpoints/best_multimodal_model.pth.

The model is loaded ONCE at startup (lazy singleton) and kept in
eval mode on CPU. No new architecture is created and no weights
are modified.
"""

import sys
from pathlib import Path

import torch

from app import config

# ------------------------------------------------------------
# Ensure the existing src package is importable.
# The model class lives in src/models/multimodal_model.py.
# ------------------------------------------------------------

_SRC_ROOT = config.PROJECT_ROOT

if str(_SRC_ROOT) not in sys.path:
    sys.path.insert(0, str(_SRC_ROOT))

from src.models.multimodal_model import (  # noqa: E402
    MultimodalEfficientNet,
)

# ------------------------------------------------------------
# Lazy singleton
# ------------------------------------------------------------

_model = None

_checkpoint_info = None


def _load_model():
    """
    Create the model with the existing training config and load
    checkpoint["model_state_dict"] onto CPU.
    """
    checkpoint_path = Path(config.CHECKPOINT_PATH)

    if not checkpoint_path.exists():
        raise FileNotFoundError(
            f"Checkpoint not found: {checkpoint_path}"
        )

    checkpoint = torch.load(
        checkpoint_path,
        map_location=config.DEVICE,
        weights_only=False,
    )

    model = MultimodalEfficientNet(
        num_classes=config.NUM_CLASSES,
        num_regions=config.NUM_REGIONS,
        num_genders=config.NUM_GENDERS,
    )

    state_dict = checkpoint.get(
        "model_state_dict",
        checkpoint,
    )

    model.load_state_dict(state_dict)

    model.eval()

    info = {
        "device": str(config.DEVICE),
        "num_classes": config.NUM_CLASSES,
        "checkpoint_file": checkpoint_path.name,
    }

    if isinstance(checkpoint, dict):
        for key in (
            "epoch",
            "validation_accuracy",
            "validation_loss",
            "learning_rate",
        ):
            if key in checkpoint:
                info[key] = checkpoint[key]

    return model, info


def get_model():
    """Return the lazily-loaded model singleton."""
    global _model, _checkpoint_info

    if _model is None:
        _model, _checkpoint_info = _load_model()

    return _model


def get_checkpoint_info() -> dict:
    """Return information about the loaded checkpoint."""
    if _model is None:
        get_model()

    return dict(_checkpoint_info)