from pathlib import Path
import pandas as pd


# -------------------------------------------------
# Paths
# -------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

ISIC_DIR = BASE_DIR / "datasets" / "ISIC"

GROUND_TRUTH = (
    ISIC_DIR / "ISIC_2019_Training_GroundTruth.csv"
)

METADATA = (
    ISIC_DIR / "ISIC_2019_Training_Metadata.csv"
)

IMAGE_DIR = (
    ISIC_DIR
    / "ISIC_2019_Training_Input"
    / "ISIC_2019_Training_Input"
)

OUTPUT_DIR = BASE_DIR / "datasets" / "merged"
OUTPUT_DIR.mkdir(exist_ok=True)

OUTPUT_FILE = OUTPUT_DIR / "isic_metadata.csv"


# -------------------------------------------------
# Check Paths
# -------------------------------------------------

print("=" * 60)
print("ISIC 2019 Metadata Processing")
print("=" * 60)

print("\nGround Truth:")
print(GROUND_TRUTH)

print("\nMetadata:")
print(METADATA)

print("\nImage Directory:")
print(IMAGE_DIR)


if not GROUND_TRUTH.exists():
    raise FileNotFoundError(
        f"Ground truth file not found:\n{GROUND_TRUTH}"
    )

if not METADATA.exists():
    raise FileNotFoundError(
        f"Metadata file not found:\n{METADATA}"
    )

if not IMAGE_DIR.exists():
    raise FileNotFoundError(
        f"Image directory not found:\n{IMAGE_DIR}"
    )


# -------------------------------------------------
# Read CSVs
# -------------------------------------------------

gt = pd.read_csv(GROUND_TRUTH)
meta = pd.read_csv(METADATA)

print("\nGround Truth Samples :", len(gt))
print("Metadata Samples     :", len(meta))


# -------------------------------------------------
# Convert One-Hot Labels
# -------------------------------------------------

label_columns = [
    "MEL",
    "NV",
    "BCC",
    "AK",
    "BKL",
    "DF",
    "VASC",
    "SCC",
    "UNK",
]

gt["label"] = gt[label_columns].idxmax(axis=1)


# -------------------------------------------------
# Label Mapping
# -------------------------------------------------

label_map = {
    "AK": "Actinic Keratosis",
    "BCC": "Basal Cell Carcinoma",
    "BKL": "Benign Keratosis",
    "DF": "Dermatofibroma",
    "MEL": "Melanoma",
    "NV": "Melanocytic Nevus",
    "VASC": "Vascular Lesion",
    "SCC": "Squamous Cell Carcinoma",
    "UNK": "Unknown",
}

gt["label"] = gt["label"].map(label_map)


# -------------------------------------------------
# Merge Metadata + Ground Truth
# -------------------------------------------------

df = meta.merge(
    gt[["image", "label"]],
    on="image",
    how="inner",
)


# -------------------------------------------------
# Build Master Metadata
# -------------------------------------------------

master = pd.DataFrame()


master["image_path"] = df["image"].apply(
    lambda x: str(
        IMAGE_DIR / f"{x}.jpg"
    )
)


master["dataset"] = "ISIC2019"


master["age"] = df["age_approx"]


master["gender"] = (
    df["sex"]
    .fillna("Unknown")
    .astype(str)
    .str.capitalize()
)


master["region"] = (
    df["anatom_site_general"]
    .fillna("Unknown")
)


master["label"] = df["label"]


# -------------------------------------------------
# Remove Unknown Labels
# -------------------------------------------------

master = master[
    master["label"] != "Unknown"
].copy()


# -------------------------------------------------
# Verify Some Images
# -------------------------------------------------

print("\nChecking ISIC image paths...")

missing_count = 0

for path in master["image_path"].head(100):
    if not Path(path).exists():
        missing_count += 1

print(
    f"Missing images among first 100: "
    f"{missing_count}"
)


# -------------------------------------------------
# Save
# -------------------------------------------------

master.to_csv(
    OUTPUT_FILE,
    index=False,
)


print("\n" + "=" * 60)
print("ISIC Metadata Created Successfully")
print("=" * 60)

print("\nSaved To:")
print(OUTPUT_FILE)

print("\nTotal Samples:", len(master))

print("\nFirst 5 Image Paths:")

for path in master["image_path"].head():
    print(path)