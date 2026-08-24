"""
DermaAI V2 - Multimodal Inference

Loads the trained multimodal EfficientNet-B0 model and predicts
a skin disease from:

    Image + Age + Gender + Region

IMPORTANT:
- Does NOT train the model.
- Uses the existing best checkpoint.
- Uses the same metadata mappings as SkinDiseaseDataset.
"""

from pathlib import Path

import torch
import pandas as pd
from PIL import Image
from torchvision import transforms

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

MODEL_PATH = (
    PROJECT_ROOT
    / "checkpoints"
    / "best_multimodal_model.pth"
)


# ============================================================
# CONFIGURATION
# ============================================================

NUM_CLASSES = 8


CLASS_NAMES = [
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
# DEVICE
# ============================================================

device = torch.device(
    "cuda"
    if torch.cuda.is_available()
    else "cpu"
)


print("=" * 60)
print("DermaAI V2 Multimodal Prediction")
print("=" * 60)

print(f"\nDevice: {device}")


# ============================================================
# LOAD MASTER METADATA
# ============================================================

if not METADATA_PATH.exists():

    raise FileNotFoundError(
        f"\nMetadata file not found:\n"
        f"{METADATA_PATH}"
    )


metadata = pd.read_csv(
    METADATA_PATH
)


# ============================================================
# CREATE EXACT REGION MAPPING
# ============================================================

regions = sorted(
    metadata["region"]
    .dropna()
    .unique()
)


REGION_MAPPING = {
    region: idx
    for idx, region in enumerate(regions)
}


print("\nRegion Mapping:")

for region, index in REGION_MAPPING.items():

    print(
        f"{region} -> {index}"
    )


# ============================================================
# CREATE EXACT GENDER MAPPING
# ============================================================

GENDER_MAPPING = {
    "Male": 0,
    "Female": 1,
}


# ============================================================
# IMAGE TRANSFORM
# ============================================================

transform = transforms.Compose(
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
# LOAD MODEL
# ============================================================

print("\nLoading trained model...")


if not MODEL_PATH.exists():

    raise FileNotFoundError(
        f"\nModel checkpoint not found:\n"
        f"{MODEL_PATH}"
    )


model = MultimodalEfficientNet(
    num_classes=NUM_CLASSES
)


model = model.to(device)



checkpoint = torch.load(
    MODEL_PATH,
    map_location=device,
)


if "model_state_dict" in checkpoint:

    model.load_state_dict(
        checkpoint["model_state_dict"]
    )

else:

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
            f"Validation Accuracy: "
            f"{checkpoint['validation_accuracy'] * 100:.2f}%"
        )


# ============================================================
# PREDICTION FUNCTION
# ============================================================

def predict(
    image_path,
    age,
    gender,
    region,
):

    image_path = Path(
        image_path
    )


    # --------------------------------------------------------
    # Check image
    # --------------------------------------------------------

    if not image_path.exists():

        raise FileNotFoundError(
            f"\nImage not found:\n"
            f"{image_path}"
        )


    # --------------------------------------------------------
    # Load image
    # --------------------------------------------------------

    image = Image.open(
        image_path
    ).convert("RGB")


    # --------------------------------------------------------
    # Transform image
    # --------------------------------------------------------

    image_tensor = transform(
        image
    )


    image_tensor = image_tensor.unsqueeze(
        0
    )


    # --------------------------------------------------------
    # Age
    # --------------------------------------------------------

    age_tensor = torch.tensor(
        [float(age)],
        dtype=torch.float32,
    )


    # --------------------------------------------------------
    # Gender
    # --------------------------------------------------------

    gender_text = str(
        gender
    ).strip().capitalize()


    if gender_text in GENDER_MAPPING:

        gender_value = GENDER_MAPPING[
            gender_text
        ]

    else:

        print(
            "\nUnknown gender. "
            "Using Male encoding (0)."
        )

        gender_value = 0


    gender_tensor = torch.tensor(
        [gender_value],
        dtype=torch.long,
    )


    # --------------------------------------------------------
    # Region
    # --------------------------------------------------------

    region_text = str(
        region
    ).strip()


    if region_text in REGION_MAPPING:

        region_value = REGION_MAPPING[
            region_text
        ]

    else:

        print(
            f"\nUnknown region: "
            f"{region_text}"
        )

        print(
            "Using region encoding 0."
        )

        region_value = 0


    region_tensor = torch.tensor(
        [region_value],
        dtype=torch.long,
    )


    # --------------------------------------------------------
    # Move tensors to device
    # --------------------------------------------------------

    image_tensor = image_tensor.to(
        device
    )

    age_tensor = age_tensor.to(
        device
    )

    gender_tensor = gender_tensor.to(
        device
    )

    region_tensor = region_tensor.to(
        device
    )


    # ========================================================
    # MODEL PREDICTION
    # ========================================================

    with torch.no_grad():

        outputs = model(
            image_tensor,
            age_tensor,
            gender_tensor,
            region_tensor,
        )


        probabilities = torch.softmax(
            outputs,
            dim=1,
        )


    # ========================================================
    # TOP PREDICTION
    # ========================================================

    confidence, predicted_class = torch.max(
        probabilities,
        dim=1,
    )


    predicted_class = (
        predicted_class.item()
    )

    confidence = (
        confidence.item()
    )


    predicted_label = CLASS_NAMES[
        predicted_class
    ]


    # ========================================================
    # TOP 3 PREDICTIONS
    # ========================================================

    top_probabilities, top_indices = torch.topk(
        probabilities,
        k=3,
        dim=1,
    )


    # ========================================================
    # DISPLAY RESULT
    # ========================================================

    print("\n" + "=" * 60)
    print("PREDICTION RESULT")
    print("=" * 60)


    print(
        f"\nImage      : "
        f"{image_path.name}"
    )

    print(
        f"Age        : "
        f"{age}"
    )

    print(
        f"Gender     : "
        f"{gender_text}"
    )

    print(
        f"Region     : "
        f"{region_text}"
    )


    print(
        f"\nPrediction : "
        f"{predicted_label}"
    )

    print(
        f"Confidence : "
        f"{confidence * 100:.2f}%"
    )


    print("\nTop 3 Predictions:")


    for probability, index in zip(
        top_probabilities[0],
        top_indices[0],
    ):

        class_id = index.item()

        probability = probability.item()


        print(
            f"{CLASS_NAMES[class_id]:25s}"
            f"{probability * 100:.2f}%"
        )


    print("\n" + "=" * 60)


    return (
        predicted_label,
        confidence,
    )


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":

    print(
        "\nEnter patient/image information."
    )


    image_path = input(
        "\nImage path: "
    ).strip()


    age = input(
        "Age: "
    ).strip()


    gender = input(
        "Gender (Male/Female): "
    ).strip()


    print(
        "\nAvailable regions:"
    )

    for region in REGION_MAPPING:

        print(
            f"  {region}"
        )


    region = input(
        "\nRegion: "
    ).strip()


    predict(
        image_path=image_path,
        age=age,
        gender=gender,
        region=region,
    )