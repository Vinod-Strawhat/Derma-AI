"""
Test the DermaAI multimodal model with one batch.

Checks:
    Image + Age + Gender + Region
        ↓
    MultimodalEfficientNet
        ↓
    8-class output
"""

from pathlib import Path

import torch
from torchvision import transforms

from src.data.dataset import SkinDiseaseDataset
from src.data.dataloader import get_train_dataloader
from src.models.multimodal_model import MultimodalEfficientNet


# ==========================================================
# Configuration
# ==========================================================

METADATA_PATH = Path(
    "datasets/merged/master_metadata.csv"
)

BATCH_SIZE = 4

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)


# ==========================================================
# Image Transform
# ==========================================================

image_transforms = transforms.Compose(
    [
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
    ]
)


# ==========================================================
# Header
# ==========================================================

print("=" * 60)
print("DermaAI Multimodal Model Test")
print("=" * 60)

print(f"\nDevice: {DEVICE}")


# ==========================================================
# Dataset
# ==========================================================

dataset = SkinDiseaseDataset(
    metadata_path=METADATA_PATH,
    transforms=image_transforms,
)

print(
    f"\nDataset Samples: {len(dataset)}"
)


# ==========================================================
# DataLoader
# ==========================================================

dataloader = get_train_dataloader(
    dataset=dataset,
    batch_size=BATCH_SIZE,
    num_workers=0,
)


# ==========================================================
# Get One Batch
# ==========================================================

images, ages, genders, regions, labels = next(
    iter(dataloader)
)


print("\nBatch Loaded Successfully!")

print(
    f"Images Shape  : {images.shape}"
)

print(
    f"Ages Shape    : {ages.shape}"
)

print(
    f"Genders Shape : {genders.shape}"
)

print(
    f"Regions Shape : {regions.shape}"
)

print(
    f"Labels Shape  : {labels.shape}"
)


# ==========================================================
# Build Model
# ==========================================================

model = MultimodalEfficientNet(
    num_classes=8,
    num_regions=50,
    num_genders=3,
)

model = model.to(DEVICE)

model.eval()

print("\nModel Created Successfully!")


# ==========================================================
# Move Batch to Device
# ==========================================================

images = images.to(DEVICE)
ages = ages.to(DEVICE)
genders = genders.to(DEVICE)
regions = regions.to(DEVICE)
labels = labels.to(DEVICE)


# ==========================================================
# Forward Pass
# ==========================================================

with torch.no_grad():

    outputs = model(
        images,
        ages,
        genders,
        regions,
    )


# ==========================================================
# Verify Output
# ==========================================================

print("\nForward Pass Successful!")

print(
    f"\nInput Image Shape : {images.shape}"
)

print(
    f"Output Shape      : {outputs.shape}"
)

print(
    f"Expected Shape    : ({BATCH_SIZE}, 8)"
)


# ==========================================================
# Predictions
# ==========================================================

predictions = torch.argmax(
    outputs,
    dim=1,
)

print("\nPredictions:")
print(predictions)

print("\nActual Labels:")
print(labels)


# ==========================================================
# Final Verification
# ==========================================================

expected_shape = (
    BATCH_SIZE,
    8,
)

if outputs.shape == expected_shape:

    print("\n" + "=" * 60)
    print("✅ MULTIMODAL MODEL TEST PASSED")
    print("=" * 60)

else:

    print("\n" + "=" * 60)
    print("❌ OUTPUT SHAPE IS INCORRECT")
    print("=" * 60)

    raise RuntimeError(
        f"Expected output shape "
        f"{expected_shape}, "
        f"but received {outputs.shape}"
    )