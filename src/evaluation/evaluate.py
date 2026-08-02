"""
Evaluate the trained DermaAI model on the validation dataset.
"""

from pathlib import Path

import torch
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
)
from torch.utils.data import random_split

from src.data.dataset import HAM10000Dataset
from src.data.dataloader import get_validation_dataloader
from src.models.efficientnet import build_model
from src.preprocessing.image_preprocessing import (
    get_validation_transforms,
)

# --------------------------------------------------
# Device
# --------------------------------------------------

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

# --------------------------------------------------
# Project Paths
# --------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

METADATA_PATH = (
    PROJECT_ROOT
    / "dataset"
    / "metadata"
    / "HAM10000_metadata.csv"
)

IMAGE_DIR = PROJECT_ROOT / "dataset" / "images"

MODEL_PATH = PROJECT_ROOT / "best_model.pth"


# --------------------------------------------------
# Load Model
# --------------------------------------------------

def load_model():

    model = build_model()

    model.load_state_dict(
        torch.load(
            MODEL_PATH,
            map_location=device,
        )
    )

    model.to(device)

    model.eval()

    return model


# --------------------------------------------------
# Evaluate Model
# --------------------------------------------------

def evaluate_model(model):

    dataset = HAM10000Dataset(
        metadata_path=METADATA_PATH,
        image_dir=IMAGE_DIR,
        transforms=get_validation_transforms(),
    )

    train_size = int(0.8 * len(dataset))
    validation_size = len(dataset) - train_size
    generator = torch.Generator().manual_seed(42)
    _, validation_dataset = random_split(
        dataset,
        [train_size, validation_size],
        generator=generator,
    )

    validation_loader = get_validation_dataloader(
        validation_dataset,
        batch_size=32,
    )

    all_labels = []
    all_predictions = []

    with torch.no_grad():

        for images, labels in validation_loader:

            images = images.to(device)

            outputs = model(images)

            _, predictions = torch.max(
                outputs,
                dim=1,
            )

            all_labels.extend(
                labels.numpy()
            )

            all_predictions.extend(
                predictions.cpu().numpy()
            )

    accuracy = accuracy_score(
        all_labels,
        all_predictions,
    )

    precision = precision_score(
        all_labels,
        all_predictions,
        average="weighted",
    )

    recall = recall_score(
        all_labels,
        all_predictions,
        average="weighted",
    )

    f1 = f1_score(
        all_labels,
        all_predictions,
        average="weighted",
    )

    cm = confusion_matrix(
        all_labels,
        all_predictions,
    )

    return (
        accuracy,
        precision,
        recall,
        f1,
        cm,
    )


# --------------------------------------------------
# Main
# --------------------------------------------------

def main():

    model = load_model()

    (
        accuracy,
        precision,
        recall,
        f1,
        cm,
    ) = evaluate_model(model)

    print("=" * 50)
    print("Model Evaluation")
    print("=" * 50)

    print(f"Accuracy  : {accuracy:.2%}")
    print(f"Precision : {precision:.2%}")
    print(f"Recall    : {recall:.2%}")
    print(f"F1 Score  : {f1:.2%}")

    print("\nConfusion Matrix\n")

    print(cm)


if __name__ == "__main__":
    main()