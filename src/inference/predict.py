"""
Inference utilities for DermaAI.

Loads the trained model and predicts the disease
from a single skin lesion image.
"""

from pathlib import Path

import torch
from PIL import Image

from src.data.dataset import HAM10000Dataset
from src.models.efficientnet import build_model
from src.preprocessing.image_preprocessing import get_validation_transforms


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

MODEL_PATH = PROJECT_ROOT / "best_model.pth"

# --------------------------------------------------
# Label Mapping
# --------------------------------------------------

INDEX_TO_LABEL = {
    value: key
    for key, value in HAM10000Dataset.LABEL_MAPPING.items()
}

DISEASE_NAMES = {
    "akiec": "Actinic Keratoses",
    "bcc": "Basal Cell Carcinoma",
    "bkl": "Benign Keratosis",
    "df": "Dermatofibroma",
    "mel": "Melanoma",
    "nv": "Melanocytic Nevus",
    "vasc": "Vascular Lesion",
}


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
# Predict Image
# --------------------------------------------------

def predict_image(
    model,
    image_path,
):

    image = Image.open(image_path).convert("RGB")

    transforms = get_validation_transforms()

    image = transforms(image)

    image = image.unsqueeze(0)

    image = image.to(device)

    with torch.no_grad():

        outputs = model(image)

        probabilities = torch.softmax(
            outputs,
            dim=1,
        )

        confidence, prediction = torch.max(
            probabilities,
            dim=1,
        )

    predicted_label = INDEX_TO_LABEL[
        prediction.item()
    ]

    disease_name = DISEASE_NAMES[
        predicted_label
    ]

    confidence = confidence.item() * 100

    return disease_name, confidence


# --------------------------------------------------
# Main
# --------------------------------------------------

def main():

    model = load_model()

    image_path = input(
        "Enter image path: "
    )

    disease, confidence = predict_image(
        model,
        image_path,
    )

    print("\nPrediction")
    print("-" * 30)

    print(
        f"Disease   : {disease}"
    )

    print(
        f"Confidence: {confidence:.2f}%"
    )


if __name__ == "__main__":
    main()