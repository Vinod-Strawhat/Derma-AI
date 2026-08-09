"""
Evaluate the trained DermaAI V2 Multimodal Model.

This script:
1. Loads the best trained multimodal checkpoint.
2. Recreates the same 80/20 train-validation split.
3. Evaluates the validation set.
4. Calculates accuracy, precision, recall and F1-score.
5. Generates a confusion matrix.
6. Saves the evaluation results.

IMPORTANT:
This does NOT retrain the model.
"""

from pathlib import Path

import torch
from torch.utils.data import Subset
from torchvision import transforms

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix,
)

from src.data.dataset import SkinDiseaseDataset
from src.data.dataloader import get_validation_dataloader
from src.models.multimodal_model import MultimodalEfficientNet


# ============================================================
# PROJECT PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

METADATA_PATH = (
    PROJECT_ROOT
    / "datasets"
    / "merged"
    / "master_metadata.csv"
)

CHECKPOINT_PATH = (
    PROJECT_ROOT
    / "checkpoints"
    / "best_multimodal_model.pth"
)

RESULTS_DIR = (
    PROJECT_ROOT
    / "results"
)

RESULTS_DIR.mkdir(
    exist_ok=True
)


# ============================================================
# CONFIGURATION
# ============================================================

BATCH_SIZE = 16

RANDOM_SEED = 42

VALIDATION_SPLIT = 0.2

NUM_CLASSES = 8


# ============================================================
# DEVICE
# ============================================================

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("=" * 60)
print("DermaAI V2 Multimodal Model Evaluation")
print("=" * 60)

print(f"\nDevice: {device}")


# ============================================================
# CHECKPOINT
# ============================================================

if not CHECKPOINT_PATH.exists():

    raise FileNotFoundError(
        f"\nModel checkpoint not found:\n"
        f"{CHECKPOINT_PATH}"
    )

print(
    f"\nCheckpoint:\n"
    f"{CHECKPOINT_PATH}"
)


# ============================================================
# VALIDATION TRANSFORMS
# ============================================================

validation_transforms = transforms.Compose(
    [
        transforms.Resize(
            (224, 224)
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


# ============================================================
# LOAD DATASET
# ============================================================

print("\nLoading dataset...")


dataset = SkinDiseaseDataset(
    metadata_path=METADATA_PATH,
    transforms=validation_transforms,
)


print(
    f"Total Samples: {len(dataset)}"
)


# ============================================================
# RECREATE SAME 80/20 SPLIT
# ============================================================

train_size = int(
    (1 - VALIDATION_SPLIT)
    * len(dataset)
)

validation_size = (
    len(dataset) - train_size
)


generator = torch.Generator().manual_seed(
    RANDOM_SEED
)


train_subset, validation_subset = torch.utils.data.random_split(
    range(len(dataset)),
    [
        train_size,
        validation_size,
    ],
    generator=generator,
)


# We only need the validation indices.

validation_indices = validation_subset.indices


validation_dataset = Subset(
    dataset,
    validation_indices,
)


print(
    f"\nValidation Samples: "
    f"{len(validation_dataset)}"
)


# ============================================================
# VALIDATION DATALOADER
# ============================================================

validation_loader = get_validation_dataloader(
    dataset=validation_dataset,
    batch_size=BATCH_SIZE,
    num_workers=0,
)


print(
    f"Validation Batches: "
    f"{len(validation_loader)}"
)


# ============================================================
# CREATE MODEL
# ============================================================

print("\nCreating model...")


model = MultimodalEfficientNet(
    num_classes=NUM_CLASSES
)


model = model.to(device)


# ============================================================
# LOAD BEST CHECKPOINT
# ============================================================

print("\nLoading trained model...")


checkpoint = torch.load(
    CHECKPOINT_PATH,
    map_location=device,
)


# Our training script saved the model inside
# "model_state_dict".

if "model_state_dict" in checkpoint:

    model.load_state_dict(
        checkpoint["model_state_dict"]
    )

else:

    # Fallback in case the checkpoint
    # contains only the state dictionary.

    model.load_state_dict(
        checkpoint
    )


model.eval()


print(
    "Model loaded successfully."
)


# ============================================================
# CHECKPOINT INFORMATION
# ============================================================

if isinstance(checkpoint, dict):

    if "epoch" in checkpoint:

        print(
            f"Best Epoch: "
            f"{checkpoint['epoch']}"
        )

    if "validation_accuracy" in checkpoint:

        print(
            f"Saved Validation Accuracy: "
            f"{checkpoint['validation_accuracy']:.4f}"
        )

    if "validation_loss" in checkpoint:

        print(
            f"Saved Validation Loss: "
            f"{checkpoint['validation_loss']:.4f}"
        )


# ============================================================
# EVALUATION
# ============================================================

print("\n" + "=" * 60)
print("Evaluating Validation Set")
print("=" * 60)


all_predictions = []

all_labels = []


with torch.no_grad():

    for batch in validation_loader:

        images, ages, genders, regions, labels = batch


        images = images.to(device)

        ages = ages.to(device)

        genders = genders.to(device)

        regions = regions.to(device)

        labels = labels.to(device)


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
        # Predictions
        # ----------------------------------------------------

        predictions = torch.argmax(
            outputs,
            dim=1,
        )


        all_predictions.extend(
            predictions.cpu().numpy()
        )

        all_labels.extend(
            labels.cpu().numpy()
        )


# ============================================================
# ACCURACY
# ============================================================

accuracy = accuracy_score(
    all_labels,
    all_predictions,
)


# ============================================================
# PRECISION
# ============================================================

precision = precision_score(
    all_labels,
    all_predictions,
    average="weighted",
    zero_division=0,
)


# ============================================================
# RECALL
# ============================================================

recall = recall_score(
    all_labels,
    all_predictions,
    average="weighted",
    zero_division=0,
)


# ============================================================
# F1 SCORE
# ============================================================

f1 = f1_score(
    all_labels,
    all_predictions,
    average="weighted",
    zero_division=0,
)


# ============================================================
# PRINT OVERALL RESULTS
# ============================================================

print("\n" + "=" * 60)
print("OVERALL RESULTS")
print("=" * 60)


print(
    f"\nAccuracy  : {accuracy:.4f}"
)

print(
    f"Accuracy  : {accuracy * 100:.2f}%"
)

print(
    f"Precision : {precision:.4f}"
)

print(
    f"Recall    : {recall:.4f}"
)

print(
    f"F1-Score  : {f1:.4f}"
)


# ============================================================
# CLASS NAMES
# ============================================================

class_names = [
    "Actinic Keratosis",
    "Basal Cell Carcinoma",
    "Benign Keratosis",
    "Dermatofibroma",
    "Melanoma",
    "Melanocytic Nevus",
    "Squamous Cell Carcinoma",
    "Vascular Lesion",
]


# ============================================================
# CLASSIFICATION REPORT
# ============================================================

print("\n" + "=" * 60)
print("PER-CLASS CLASSIFICATION REPORT")
print("=" * 60)


report = classification_report(
    all_labels,
    all_predictions,
    labels=list(range(NUM_CLASSES)),
    target_names=class_names,
    digits=4,
    zero_division=0,
)


print("\n")
print(report)


# ============================================================
# CONFUSION MATRIX
# ============================================================

cm = confusion_matrix(
    all_labels,
    all_predictions,
    labels=list(range(NUM_CLASSES)),
)


print("\n" + "=" * 60)
print("CONFUSION MATRIX")
print("=" * 60)


print("\nRows = Actual")
print("Columns = Predicted\n")

print(cm)


# ============================================================
# SAVE RESULTS
# ============================================================

results_file = (
    RESULTS_DIR
    / "evaluation_results.txt"
)


with open(
    results_file,
    "w",
    encoding="utf-8",
) as file:

    file.write(
        "DermaAI V2 Multimodal Model Evaluation\n"
    )

    file.write(
        "=" * 60
        + "\n\n"
    )

    file.write(
        f"Checkpoint: {CHECKPOINT_PATH}\n"
    )

    if isinstance(checkpoint, dict):

        if "epoch" in checkpoint:

            file.write(
                f"Best Epoch: "
                f"{checkpoint['epoch']}\n"
            )

        if "validation_accuracy" in checkpoint:

            file.write(
                f"Saved Validation Accuracy: "
                f"{checkpoint['validation_accuracy']:.4f}\n"
            )

    file.write(
        f"\nEvaluation Accuracy: "
        f"{accuracy:.4f} "
        f"({accuracy * 100:.2f}%)\n"
    )

    file.write(
        f"Precision: {precision:.4f}\n"
    )

    file.write(
        f"Recall: {recall:.4f}\n"
    )

    file.write(
        f"F1-Score: {f1:.4f}\n"
    )

    file.write(
        "\n\nClassification Report\n"
    )

    file.write(
        "=" * 60
        + "\n\n"
    )

    file.write(
        report
    )

    file.write(
        "\n\nConfusion Matrix\n"
    )

    file.write(
        "=" * 60
        + "\n\n"
    )

    file.write(
        str(cm)
    )


print(
    f"\nResults saved to:\n"
    f"{results_file}"
)


# ============================================================
# FINISHED
# ============================================================

print("\n" + "=" * 60)
print("✅ EVALUATION COMPLETED")
print("=" * 60)