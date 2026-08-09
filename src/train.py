"""
DermaAI Version 2 - Multimodal Training Script

Trains:
    Image + Age + Gender + Region
        ↓
    Multimodal EfficientNet-B0
        ↓
    8 disease classes

Uses class-weighted CrossEntropyLoss to handle
class imbalance without deleting samples.
"""

from pathlib import Path

import torch
from torch import nn
from torch.optim import AdamW
from torch.utils.data import random_split, Subset

from torchvision import transforms

from src.data.dataset import SkinDiseaseDataset
from src.data.dataloader import (
    get_train_dataloader,
    get_validation_dataloader,
)
from src.models.multimodal_model import MultimodalEfficientNet


# ============================================================
# Configuration
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parent.parent

METADATA_PATH = (
    PROJECT_ROOT
    / "datasets"
    / "merged"
    / "master_metadata.csv"
)

BATCH_SIZE = 16

NUM_EPOCHS = 20

LEARNING_RATE = 0.0001

VALIDATION_SPLIT = 0.2

RANDOM_SEED = 42

NUM_CLASSES = 8

NUM_REGIONS = 50

NUM_GENDERS = 3


# ============================================================
# Device
# ============================================================

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("=" * 60)
print("DermaAI V2 Multimodal Training")
print("=" * 60)

print(f"\nDevice: {device}")


# ============================================================
# Image Transforms
# ============================================================

# Training images:
# Use augmentation so the model sees slightly different
# versions of the same images during training.

train_transforms = transforms.Compose(
    [
        transforms.Resize((224, 224)),

        transforms.RandomHorizontalFlip(
            p=0.5
        ),

        transforms.RandomRotation(
            10
        ),

        transforms.ToTensor(),

        transforms.Normalize(
            mean=[
                0.485,
                0.456,
                0.406,
            ],
            std=[
                0.229,
                0.224,
                0.225,
            ],
        ),
    ]
)


# Validation images:
# No random augmentation.

validation_transforms = transforms.Compose(
    [
        transforms.Resize((224, 224)),

        transforms.ToTensor(),

        transforms.Normalize(
            mean=[
                0.485,
                0.456,
                0.406,
            ],
            std=[
                0.229,
                0.224,
                0.225,
            ],
        ),
    ]
)


# ============================================================
# Create Base Dataset
# ============================================================

print("\nLoading dataset...")


# This dataset is used only to obtain metadata,
# labels and the train/validation indices.

base_dataset = SkinDiseaseDataset(
    metadata_path=METADATA_PATH,
    transforms=None,
)


print(
    f"Total Samples: {len(base_dataset)}"
)


# ============================================================
# Train / Validation Split
# ============================================================

train_size = int(
    (1 - VALIDATION_SPLIT)
    * len(base_dataset)
)

validation_size = (
    len(base_dataset) - train_size
)

generator = torch.Generator().manual_seed(
    RANDOM_SEED
)


train_indices, validation_indices = random_split(
    range(len(base_dataset)),
    [
        train_size,
        validation_size,
    ],
    generator=generator,
)


# Convert Subset objects to lists of indices

train_indices = train_indices.indices

validation_indices = validation_indices.indices


print(
    f"\nTraining Samples   : {len(train_indices)}"
)

print(
    f"Validation Samples : {len(validation_indices)}"
)


# ============================================================
# Create Separate Train and Validation Datasets
# ============================================================

# IMPORTANT:
#
# We create TWO dataset objects so that training augmentation
# does not accidentally affect validation images.

train_base_dataset = SkinDiseaseDataset(
    metadata_path=METADATA_PATH,
    transforms=train_transforms,
)

validation_base_dataset = SkinDiseaseDataset(
    metadata_path=METADATA_PATH,
    transforms=validation_transforms,
)


train_dataset = Subset(
    train_base_dataset,
    train_indices,
)

validation_dataset = Subset(
    validation_base_dataset,
    validation_indices,
)


# ============================================================
# DataLoaders
# ============================================================

train_loader = get_train_dataloader(
    dataset=train_dataset,
    batch_size=BATCH_SIZE,
    num_workers=0,
)

validation_loader = get_validation_dataloader(
    dataset=validation_dataset,
    batch_size=BATCH_SIZE,
    num_workers=0,
)


print(
    f"\nTraining Batches   : {len(train_loader)}"
)

print(
    f"Validation Batches : {len(validation_loader)}"
)


# ============================================================
# Calculate Class Weights
# ============================================================

print("\nCalculating class weights...")


labels = base_dataset.metadata["label"].map(
    base_dataset.LABEL_MAPPING
)


train_labels = labels.iloc[
    train_indices
]


class_counts = torch.bincount(
    torch.tensor(
        train_labels.values,
        dtype=torch.long,
    ),
    minlength=NUM_CLASSES,
).float()


print("\nTraining Class Counts:")

for class_id, count in enumerate(
    class_counts
):
    print(
        f"Class {class_id}: "
        f"{int(count.item())}"
    )


# ============================================================
# Inverse-Frequency Class Weights
# ============================================================

class_weights = (
    class_counts.sum()
    / (
        NUM_CLASSES
        * class_counts.clamp(min=1)
    )
)


print("\nClass Weights:")

for class_id, weight in enumerate(
    class_weights
):
    print(
        f"Class {class_id}: "
        f"{weight.item():.4f}"
    )


class_weights = class_weights.to(
    device
)


# ============================================================
# Model
# ============================================================

print("\nCreating model...")


model = MultimodalEfficientNet(
    num_classes=NUM_CLASSES,
    num_regions=NUM_REGIONS,
    num_genders=NUM_GENDERS,
)


model = model.to(device)


print(
    "Model created successfully."
)


# ============================================================
# Loss Function
# ============================================================

criterion = nn.CrossEntropyLoss(
    weight=class_weights
)


# ============================================================
# Optimizer
# ============================================================

optimizer = AdamW(
    model.parameters(),
    lr=LEARNING_RATE,
    weight_decay=1e-4,
)


# ============================================================
# Learning Rate Scheduler
# ============================================================

scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
    optimizer,
    mode="min",
    factor=0.5,
    patience=2,
)


# ============================================================
# Training Function
# ============================================================

def train_one_epoch():

    model.train()

    running_loss = 0.0

    correct = 0

    total = 0


    for batch in train_loader:

        images, ages, genders, regions, labels = batch


        images = images.to(device)
        ages = ages.to(device)
        genders = genders.to(device)
        regions = regions.to(device)
        labels = labels.to(device)


        # ----------------------------------------------------
        # Clear previous gradients
        # ----------------------------------------------------

        optimizer.zero_grad()


        # ----------------------------------------------------
        # Forward Pass
        # ----------------------------------------------------

        outputs = model(
            images,
            ages,
            genders,
            regions,
        )


        # ----------------------------------------------------
        # Calculate Loss
        # ----------------------------------------------------

        loss = criterion(
            outputs,
            labels,
        )


        # ----------------------------------------------------
        # Backpropagation
        # ----------------------------------------------------

        loss.backward()


        # ----------------------------------------------------
        # Update Weights
        # ----------------------------------------------------

        optimizer.step()


        # ----------------------------------------------------
        # Statistics
        # ----------------------------------------------------

        running_loss += (
            loss.item()
            * labels.size(0)
        )


        predictions = torch.argmax(
            outputs,
            dim=1,
        )


        correct += (
            predictions == labels
        ).sum().item()


        total += labels.size(0)


    epoch_loss = (
        running_loss / total
    )


    epoch_accuracy = (
        correct / total
    )


    return (
        epoch_loss,
        epoch_accuracy,
    )


# ============================================================
# Validation Function
# ============================================================

def validate():

    model.eval()

    running_loss = 0.0

    correct = 0

    total = 0


    with torch.no_grad():

        for batch in validation_loader:

            images, ages, genders, regions, labels = batch


            images = images.to(device)
            ages = ages.to(device)
            genders = genders.to(device)
            regions = regions.to(device)
            labels = labels.to(device)


            # ------------------------------------------------
            # Forward Pass
            # ------------------------------------------------

            outputs = model(
                images,
                ages,
                genders,
                regions,
            )


            # ------------------------------------------------
            # Validation Loss
            # ------------------------------------------------

            loss = criterion(
                outputs,
                labels,
            )


            running_loss += (
                loss.item()
                * labels.size(0)
            )


            predictions = torch.argmax(
                outputs,
                dim=1,
            )


            correct += (
                predictions == labels
            ).sum().item()


            total += labels.size(0)


    validation_loss = (
        running_loss / total
    )


    validation_accuracy = (
        correct / total
    )


    return (
        validation_loss,
        validation_accuracy,
    )


# ============================================================
# Training Loop
# ============================================================

print("\n" + "=" * 60)
print("Starting Training")
print("=" * 60)


best_validation_accuracy = 0.0


for epoch in range(NUM_EPOCHS):


    print(
        f"\nEpoch {epoch + 1}/{NUM_EPOCHS}"
    )

    print("-" * 60)


    # --------------------------------------------------------
    # Training
    # --------------------------------------------------------

    train_loss, train_accuracy = (
        train_one_epoch()
    )


    # --------------------------------------------------------
    # Validation
    # --------------------------------------------------------

    validation_loss, validation_accuracy = (
        validate()
    )


    # --------------------------------------------------------
    # Scheduler
    # --------------------------------------------------------

    scheduler.step(
        validation_loss
    )


    # --------------------------------------------------------
    # Current Learning Rate
    # --------------------------------------------------------

    current_lr = optimizer.param_groups[0]["lr"]


    # --------------------------------------------------------
    # Epoch Results
    # --------------------------------------------------------

    print(
        f"Train Loss      : "
        f"{train_loss:.4f}"
    )

    print(
        f"Train Accuracy  : "
        f"{train_accuracy:.4f}"
    )

    print(
        f"Val Loss        : "
        f"{validation_loss:.4f}"
    )

    print(
        f"Val Accuracy    : "
        f"{validation_accuracy:.4f}"
    )

    print(
        f"Learning Rate   : "
        f"{current_lr:.6f}"
    )


    # ========================================================
    # Save Best Model
    # ========================================================

    if (
        validation_accuracy
        > best_validation_accuracy
    ):


        best_validation_accuracy = (
            validation_accuracy
        )


        checkpoint_dir = (
            PROJECT_ROOT
            / "checkpoints"
        )


        checkpoint_dir.mkdir(
            exist_ok=True
        )


        checkpoint_path = (
            checkpoint_dir
            / "best_multimodal_model.pth"
        )


        torch.save(
            {
                "epoch": epoch + 1,

                "model_state_dict":
                    model.state_dict(),

                "optimizer_state_dict":
                    optimizer.state_dict(),

                "validation_accuracy":
                    validation_accuracy,

                "validation_loss":
                    validation_loss,

                "learning_rate":
                    current_lr,
            },
            checkpoint_path,
        )


        print(
            "✅ Best model saved"
        )


# ============================================================
# Training Finished
# ============================================================

print("\n" + "=" * 60)
print("Training Finished")
print("=" * 60)


print(
    f"\nBest Validation Accuracy: "
    f"{best_validation_accuracy:.4f}"
)