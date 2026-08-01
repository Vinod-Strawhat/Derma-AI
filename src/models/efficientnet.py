"""
EfficientNet-B0 model for the DermaAI project.

Loads a pretrained EfficientNet-B0 model and replaces the final
classification layer for 7-class skin disease classification.
"""

from torch import nn
from torchvision.models import (
    EfficientNet_B0_Weights,
    efficientnet_b0,
)

NUM_CLASSES = 7


def build_model(
    num_classes: int = NUM_CLASSES,
) -> nn.Module:
    """
    Build the EfficientNet-B0 model.

    Args:
        num_classes: Number of output classes.

    Returns:
        Configured EfficientNet-B0 model.
    """

    model = efficientnet_b0(
        weights=EfficientNet_B0_Weights.DEFAULT
    )

    in_features = model.classifier[1].in_features

    model.classifier[1] = nn.Linear(
        in_features,
        num_classes,
    )

    return model