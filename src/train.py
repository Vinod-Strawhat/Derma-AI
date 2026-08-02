"""
Main training script for the DermaAI project.
"""

from pathlib import Path

import torch
from torch import nn
from torch.optim import Adam
from torch.utils.data import random_split

from data.dataset import HAM10000Dataset
from data.dataloader import (
    get_train_dataloader,
    get_validation_dataloader,
)
from models.efficientnet import build_model
from preprocessing.image_preprocessing import (
    get_train_transforms,
)
from training.trainer import train_model

# --------------------------------------------------
# Project Paths
# --------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent.parent

METADATA_PATH = (
    PROJECT_ROOT
    / "dataset"
    / "metadata"
    / "HAM10000_metadata.csv"
)

IMAGE_DIR = PROJECT_ROOT / "dataset" / "images"

# --------------------------------------------------
# Device
# --------------------------------------------------

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print(f"Using device: {device}")

# --------------------------------------------------
# Dataset
# --------------------------------------------------

full_dataset = HAM10000Dataset(
    metadata_path=METADATA_PATH,
    image_dir=IMAGE_DIR,
    transforms=get_train_transforms(),
)

train_size = int(0.8 * len(full_dataset))
validation_size = len(full_dataset) - train_size
generator = torch.Generator().manual_seed(42)

train_dataset, validation_dataset = random_split(
    full_dataset,
    [train_size, validation_size],
    generator=generator,
)

print(f"Training Samples   : {len(train_dataset)}")
print(f"Validation Samples : {len(validation_dataset)}")

# --------------------------------------------------
# DataLoaders
# --------------------------------------------------

train_loader = get_train_dataloader(
    dataset=train_dataset,
    batch_size=32,
)

validation_loader = get_validation_dataloader(
    dataset=validation_dataset,
    batch_size=32,
)

# --------------------------------------------------
# Model
# --------------------------------------------------

model = build_model().to(device)

# --------------------------------------------------
# Loss Function
# --------------------------------------------------

criterion = nn.CrossEntropyLoss()

# --------------------------------------------------
# Optimizer
# --------------------------------------------------

optimizer = Adam(
    model.parameters(),
    lr=0.001,
)

# --------------------------------------------------
# Training
# --------------------------------------------------

train_model(
    model=model,
    train_loader=train_loader,
    validation_loader=validation_loader,
    criterion=criterion,
    optimizer=optimizer,
    device=device,
    epochs=20,
)