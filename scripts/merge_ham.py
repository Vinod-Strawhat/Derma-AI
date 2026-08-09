from pathlib import Path

import pandas as pd


# ============================================================
# Paths
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

HAM_DIR = BASE_DIR / "datasets" / "HAM-10000"
IMAGE_DIR = HAM_DIR / "images"

METADATA_FILE = HAM_DIR / "HAM10000_metadata.csv"

OUTPUT_DIR = BASE_DIR / "datasets" / "merged"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

OUTPUT_FILE = OUTPUT_DIR / "ham_metadata.csv"


# ============================================================
# Header
# ============================================================

print("=" * 60)
print("HAM10000 Metadata Processing")
print("=" * 60)


# ============================================================
# Check Files
# ============================================================

if not METADATA_FILE.exists():
    raise FileNotFoundError(
        f"HAM metadata file not found:\n{METADATA_FILE}"
    )

if not IMAGE_DIR.exists():
    raise FileNotFoundError(
        f"HAM image directory not found:\n{IMAGE_DIR}"
    )


# ============================================================
# Load Metadata
# ============================================================

df = pd.read_csv(METADATA_FILE)

print("\nMetadata Samples:", len(df))


# ============================================================
# Find Actual Images
# ============================================================

print("\nSearching HAM images...")

image_files = {}

for image_path in IMAGE_DIR.rglob("*"):
    if image_path.is_file():
        image_files[image_path.stem] = image_path


print(
    "Images Found:",
    len(image_files)
)


# ============================================================
# Build Image Paths
# ============================================================

df["image_path"] = df["image_id"].apply(
    lambda image_id: str(
        image_files[image_id]
    )
    if image_id in image_files
    else None
)


# ============================================================
# Check Missing Images
# ============================================================

missing = df["image_path"].isna()

missing_count = missing.sum()

print(
    "\nMissing Images:",
    missing_count
)

print(
    "Valid Images:",
    len(df) - missing_count
)


# ============================================================
# Remove Rows With Missing Images
# ============================================================

if missing_count > 0:

    print(
        "\nRemoving rows whose images "
        "are not present on disk..."
    )

    df = df.loc[~missing].copy()


# ============================================================
# Label Mapping
# ============================================================

label_mapping = {
    "akiec": "Actinic Keratosis",
    "bcc": "Basal Cell Carcinoma",
    "bkl": "Benign Keratosis",
    "df": "Dermatofibroma",
    "mel": "Melanoma",
    "nv": "Melanocytic Nevus",
    "vasc": "Vascular Lesion",
}


df["label"] = df["dx"].map(label_mapping)


# ============================================================
# Gender
# ============================================================

df["gender"] = (
    df["sex"]
    .fillna("Unknown")
    .astype(str)
    .str.capitalize()
)


# ============================================================
# Age
# ============================================================

df["age"] = df["age"].fillna(
    df["age"].median()
)


# ============================================================
# Region
# ============================================================

df["region"] = (
    df["localization"]
    .fillna("Unknown")
    .astype(str)
)


# ============================================================
# Dataset Name
# ============================================================

df["dataset"] = "HAM10000"


# ============================================================
# Select Final Columns
# ============================================================

master = df[
    [
        "image_path",
        "dataset",
        "age",
        "gender",
        "region",
        "label",
    ]
].copy()


# ============================================================
# Remove Invalid Labels
# ============================================================

master = master[
    master["label"].notna()
].copy()


# ============================================================
# Verify Every Image
# ============================================================

print("\nFinal image verification...")

invalid_paths = []

for path in master["image_path"]:

    if not Path(path).exists():
        invalid_paths.append(path)


if invalid_paths:

    print(
        f"WARNING: {len(invalid_paths)} "
        "invalid image paths remain."
    )

    master = master[
        ~master["image_path"].isin(invalid_paths)
    ].copy()

else:

    print("All image paths are valid.")


# ============================================================
# Save
# ============================================================

master.to_csv(
    OUTPUT_FILE,
    index=False,
)


# ============================================================
# Summary
# ============================================================

print("\n" + "=" * 60)
print("HAM10000 Metadata Created Successfully")
print("=" * 60)

print("\nSaved To:")
print(OUTPUT_FILE)

print("\nTotal Valid Samples:")
print(len(master))

print("\nLabel Distribution:")
print(
    master["label"].value_counts()
)