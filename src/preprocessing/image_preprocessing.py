"""
Image preprocessing transforms for the HAM10000 dataset.

Provides reusable torchvision transform pipelines for training and
validation. Augmentation is intentionally excluded at this stage.
"""

# NOTE:
# Training and validation currently use identical preprocessing.
# Data augmentation will be introduced only after the baseline model
# has been trained and evaluated.

from torchvision import transforms

# Input size expected by EfficientNet-B0 and ImageNet-pretrained models.
DEFAULT_IMAGE_SIZE: tuple[int, int] = (224, 224)

# Standard ImageNet normalization statistics for pretrained backbones.
IMAGENET_MEAN: list[float] = [0.485, 0.456, 0.406]
IMAGENET_STD: list[float] = [0.229, 0.224, 0.225]


def _build_base_transforms(
    image_size: tuple[int, int] = DEFAULT_IMAGE_SIZE,
) -> transforms.Compose:
    """
    Build the shared preprocessing pipeline used before augmentation.

    Returns:
        Composed transforms that resize, convert to tensor, and normalize.
    """
    return transforms.Compose(
        [
            transforms.Resize(image_size),
            transforms.ToTensor(),
            transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
        ]
    )


def get_train_transforms(
    image_size: tuple[int, int] = DEFAULT_IMAGE_SIZE,
) -> transforms.Compose:
    """
    Return preprocessing transforms for training images.

    At this stage, training transforms match validation transforms.
    Data augmentation will be added here in a future module.

    Returns:
        Composed torchvision transforms for training data.
    """
    return _build_base_transforms(image_size=image_size)


def get_validation_transforms(
    image_size: tuple[int, int] = DEFAULT_IMAGE_SIZE,
) -> transforms.Compose:
    """
    Return preprocessing transforms for validation images.

    Validation uses deterministic preprocessing without augmentation.

    Returns:
        Composed torchvision transforms for validation data.
    """
    return _build_base_transforms(image_size=image_size)
