"""
Training utilities for the DermaAI project.

Provides functions to train and validate the EfficientNet model.
"""

import torch
from torch import nn
from torch.optim import Optimizer
from torch.utils.data import DataLoader


def train_one_epoch(
    model: nn.Module,
    dataloader: DataLoader,
    criterion: nn.Module,
    optimizer: Optimizer,
    device: torch.device,
) -> float:
    """
    Train the model for one epoch.

    Args:
        model: Neural network model.
        dataloader: Training DataLoader.
        criterion: Loss function.
        optimizer: Optimizer.
        device: CPU or GPU.

    Returns:
        Average training loss.
    """

    model.train()

    running_loss = 0.0
    correct = 0
    total = 0
    
    for images, labels in dataloader:

        images = images.to(device)
        labels = labels.to(device)

        optimizer.zero_grad()

        outputs = model(images)
        _, predictions = torch.max(outputs, dim=1)

        correct += (predictions == labels).sum().item()
        total += labels.size(0)

        loss = criterion(outputs, labels)

        loss.backward()

        optimizer.step()

        running_loss += loss.item()
    average_loss = running_loss / len(dataloader)
    accuracy = correct / total

    return average_loss, accuracy
def validate_one_epoch(
    model: nn.Module,
    dataloader: DataLoader,
    criterion: nn.Module,
    device: torch.device,
) -> float:
    """
    Validate the model for one epoch.

    Args:
        model: Neural network model.
        dataloader: Validation DataLoader.
        criterion: Loss function.
        device: CPU or GPU.

    Returns:
        Average validation loss.
    """

    model.eval()

    running_loss = 0.0
    correct = 0
    total = 0

    with torch.no_grad():

        for images, labels in dataloader:

            images = images.to(device)
            labels = labels.to(device)

            outputs = model(images)
            _, predictions = torch.max(outputs, dim=1)

            correct += (predictions == labels).sum().item()
            total += labels.size(0)

            loss = criterion(outputs, labels)

            running_loss += loss.item()

    average_loss = running_loss / len(dataloader)
    accuracy = correct / total
    return average_loss, accuracy
def train_model(
    model: nn.Module,
    train_loader: DataLoader,
    validation_loader: DataLoader,
    criterion: nn.Module,
    optimizer: Optimizer,
    device: torch.device,
    epochs: int,
) -> None:
    """
    Train the model for multiple epochs.
    """

    best_validation_loss = float("inf")

    for epoch in range(epochs):

        print("-" * 60)
        print(f"Epoch {epoch + 1}/{epochs}")

        train_loss, train_accuracy = train_one_epoch(
    model=model,
    dataloader=train_loader,
    criterion=criterion,
    optimizer=optimizer,
    device=device,
)

        validation_loss, validation_accuracy = validate_one_epoch(
    model=model,
    dataloader=validation_loader,
    criterion=criterion,
    device=device,
)

        print(f"Training Loss   : {train_loss:.4f}")
        print(f"Validation Loss : {validation_loss:.2f}")
        print(f"Training Accuracy : {train_accuracy:.4f}")
        print(f"Validation Accuracy : {validation_accuracy:.2f}")

        if validation_loss < best_validation_loss:

            best_validation_loss = validation_loss

            torch.save(
                model.state_dict(),
                "best_model.pth",
            )

            print("✅ Best model saved!")