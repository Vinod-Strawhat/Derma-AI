"""
DermaAI V2 - Grad-CAM Explainability

Generates:
1. Original image
2. Grad-CAM heatmap
3. Transparent Grad-CAM overlay

Uses the existing trained multimodal model.
NO TRAINING REQUIRED.
"""

from pathlib import Path

import cv2
import numpy as np
import pandas as pd
import torch

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

OUTPUT_DIR = (
    PROJECT_ROOT
    / "results"
    / "gradcam"
)

OUTPUT_DIR.mkdir(
    parents=True,
    exist_ok=True
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
print("DermaAI V2 - Grad-CAM")
print("=" * 60)

print(f"\nDevice: {device}")


# ============================================================
# LOAD METADATA
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
# REGION MAPPING
# ============================================================

regions = sorted(
    metadata["region"]
    .dropna()
    .unique()
)

REGION_MAPPING = {
    region: index
    for index, region in enumerate(regions)
}


print("\nRegion Mapping:")

for region, index in REGION_MAPPING.items():

    print(
        f"{region} -> {index}"
    )


# ============================================================
# GENDER MAPPING
# ============================================================

GENDER_MAPPING = {
    "Male": 0,
    "Female": 1,
}


# ============================================================
# IMAGE TRANSFORMATION
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

print("\nLoading model...")


if not MODEL_PATH.exists():

    raise FileNotFoundError(
        f"\nCheckpoint not found:\n"
        f"{MODEL_PATH}"
    )


model = MultimodalEfficientNet(
    num_classes=NUM_CLASSES
)

model = model.to(device)


checkpoint = torch.load(
    MODEL_PATH,
    map_location=device
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
# FIND LAST CONVOLUTIONAL LAYER
# ============================================================

target_layer = None
target_layer_name = None


for name, module in model.named_modules():

    if isinstance(
        module,
        torch.nn.Conv2d
    ):

        target_layer = module
        target_layer_name = name


if target_layer is None:

    raise RuntimeError(
        "No Conv2d layer found in the model."
    )


print(
    f"\nGrad-CAM Target Layer: "
    f"{target_layer_name}"
)


# ============================================================
# GRAD-CAM STORAGE
# ============================================================

activations = None
gradients = None


def forward_hook(
    module,
    input,
    output
):

    global activations

    activations = output


def backward_hook(
    module,
    grad_input,
    grad_output
):

    global gradients

    gradients = grad_output[0]


# Register hooks

forward_handle = target_layer.register_forward_hook(
    forward_hook
)

backward_handle = target_layer.register_full_backward_hook(
    backward_hook
)


# ============================================================
# GENERATE GRAD-CAM
# ============================================================

def generate_gradcam(
    image_path,
    age,
    gender,
    region
):

    global activations
    global gradients


    # --------------------------------------------------------
    # Reset previous activation/gradient
    # --------------------------------------------------------

    activations = None
    gradients = None


    # --------------------------------------------------------
    # Check image
    # --------------------------------------------------------

    image_path = Path(
        image_path
    )


    if not image_path.exists():

        raise FileNotFoundError(
            f"\nImage not found:\n"
            f"{image_path}"
        )


    # --------------------------------------------------------
    # Load original image
    # --------------------------------------------------------

    original_image = Image.open(
        image_path
    ).convert("RGB")


    original_array = np.array(
        original_image
    )


    # --------------------------------------------------------
    # Save original image
    # --------------------------------------------------------

    image_name = image_path.stem


    original_path = (
        OUTPUT_DIR
        / f"{image_name}_original.jpg"
    )


    original_image.save(
        original_path
    )


    # --------------------------------------------------------
    # Prepare image
    # --------------------------------------------------------

    image_tensor = transform(
        original_image
    ).unsqueeze(0)


    # --------------------------------------------------------
    # Age
    # --------------------------------------------------------

    age_tensor = torch.tensor(
        [float(age)],
        dtype=torch.float32
    )


    # --------------------------------------------------------
    # Gender
    # --------------------------------------------------------

    gender_text = (
        str(gender)
        .strip()
        .capitalize()
    )


    if gender_text in GENDER_MAPPING:

        gender_value = GENDER_MAPPING[
            gender_text
        ]

    else:

        print(
            "\nUnknown gender."
            " Using Male encoding."
        )

        gender_value = 0


    gender_tensor = torch.tensor(
        [gender_value],
        dtype=torch.long
    )


    # --------------------------------------------------------
    # Region
    # --------------------------------------------------------

    region_text = str(
        region
    ).strip()


    if region_text not in REGION_MAPPING:

        raise ValueError(
            f"\nUnknown region: "
            f"{region_text}\n\n"
            f"Available regions:\n"
            f"{list(REGION_MAPPING.keys())}"
        )


    region_value = REGION_MAPPING[
        region_text
    ]


    region_tensor = torch.tensor(
        [region_value],
        dtype=torch.long
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
    # FORWARD PASS
    # ========================================================

    model.zero_grad()


    outputs = model(
        image_tensor,
        age_tensor,
        gender_tensor,
        region_tensor
    )


    # ========================================================
    # PROBABILITIES
    # ========================================================

    probabilities = torch.softmax(
        outputs,
        dim=1
    )


    # ========================================================
    # PREDICTION
    # ========================================================

    confidence, predicted_class = torch.max(
        probabilities,
        dim=1
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
    # BACKWARD PASS
    # ========================================================

    score = outputs[
        0,
        predicted_class
    ]


    score.backward()


    # ========================================================
    # CHECK ACTIVATIONS
    # ========================================================

    if activations is None:

        raise RuntimeError(
            "Grad-CAM activations were not captured."
        )


    if gradients is None:

        raise RuntimeError(
            "Grad-CAM gradients were not captured."
        )


    # ========================================================
    # GET ACTIVATIONS AND GRADIENTS
    # ========================================================

    activation = (
        activations.detach()
    )

    gradient = (
        gradients.detach()
    )


    # ========================================================
    # GLOBAL AVERAGE POOLING
    # ========================================================

    weights = torch.mean(
        gradient,
        dim=(2, 3),
        keepdim=True
    )


    # ========================================================
    # WEIGHTED ACTIVATION MAP
    # ========================================================

    cam = torch.sum(
        weights * activation,
        dim=1
    )


    # ========================================================
    # RELU
    # ========================================================

    cam = torch.relu(
        cam
    )


    # Remove batch dimension

    cam = cam[
        0
    ].cpu().numpy()


    # ========================================================
    # NORMALIZE CAM
    # ========================================================

    cam_min = cam.min()
    cam_max = cam.max()


    if (
        cam_max - cam_min
        > 1e-8
    ):

        cam = (
            cam - cam_min
        ) / (
            cam_max - cam_min
        )

    else:

        cam = np.zeros_like(
            cam
        )


    # ========================================================
    # RESIZE CAM TO ORIGINAL IMAGE
    # ========================================================

    height, width = (
        original_array.shape[:2]
    )


    cam = cv2.resize(
        cam,
        (
            width,
            height
        ),
        interpolation=cv2.INTER_LINEAR
    )


    # ========================================================
    # CREATE HEATMAP
    # ========================================================

    heatmap_uint8 = np.uint8(
        255 * cam
    )


    heatmap = cv2.applyColorMap(
        heatmap_uint8,
        cv2.COLORMAP_JET
    )


    # ========================================================
    # SAVE PURE HEATMAP
    # ========================================================

    heatmap_path = (
        OUTPUT_DIR
        / f"{image_name}_heatmap.jpg"
    )


    cv2.imwrite(
        str(heatmap_path),
        heatmap
    )


    # ========================================================
    # CREATE BETTER OVERLAY
    # ========================================================

    original_bgr = cv2.cvtColor(
        original_array,
        cv2.COLOR_RGB2BGR
    )


    # --------------------------------------------------------
    # Create transparency mask
    # --------------------------------------------------------

    # Only show heatmap where activation is meaningful.

    alpha = np.clip(
        (cam - 0.20) / 0.80,
        0,
        1
    )


    # Reduce heatmap strength.

    alpha = (
        alpha * 0.30
    )


    # Convert alpha to 3 channels.

    alpha = alpha[
        ...,
        np.newaxis
    ]


    # --------------------------------------------------------
    # Convert images to float
    # --------------------------------------------------------

    original_float = (
        original_bgr.astype(
            np.float32
        )
    )


    heatmap_float = (
        heatmap.astype(
            np.float32
        )
    )


    # --------------------------------------------------------
    # Blend
    # --------------------------------------------------------

    overlay = (
        original_float
        * (1 - alpha)
        +
        heatmap_float
        * alpha
    )


    overlay = np.clip(
        overlay,
        0,
        255
    ).astype(
        np.uint8
    )


    # ========================================================
    # SAVE OVERLAY
    # ========================================================

    overlay_path = (
        OUTPUT_DIR
        / f"{image_name}_gradcam.jpg"
    )


    cv2.imwrite(
        str(overlay_path),
        overlay
    )


    # ========================================================
    # PRINT RESULT
    # ========================================================

    print("\n" + "=" * 60)
    print("GRAD-CAM RESULT")
    print("=" * 60)


    print(
        f"\nPrediction : "
        f"{predicted_label}"
    )


    print(
        f"Confidence : "
        f"{confidence * 100:.2f}%"
    )


    print(
        "\nOriginal image saved to:"
    )

    print(
        original_path
    )


    print(
        "\nHeatmap saved to:"
    )

    print(
        heatmap_path
    )


    print(
        "\nGrad-CAM overlay saved to:"
    )

    print(
        overlay_path
    )


    print("\n" + "=" * 60)


    return (
        predicted_label,
        confidence,
        original_path,
        heatmap_path,
        overlay_path
    )


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":

    print(
        "\nEnter image information."
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


    generate_gradcam(
        image_path=image_path,
        age=age,
        gender=gender,
        region=region
    )


# ============================================================
# CLEANUP
# ============================================================

forward_handle.remove()
backward_handle.remove()