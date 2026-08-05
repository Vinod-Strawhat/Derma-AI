from pathlib import Path
import pandas as pd

# -------------------------------------------------
# Paths
# -------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

ISIC_DIR = BASE_DIR / "datasets" / "ISIC"

GROUND_TRUTH = ISIC_DIR / "ISIC_2019_Training_GroundTruth.csv"
METADATA = ISIC_DIR / "ISIC_2019_Training_Metadata.csv"

OUTPUT_DIR = BASE_DIR / "datasets" / "merged"
OUTPUT_DIR.mkdir(exist_ok=True)

OUTPUT_FILE = OUTPUT_DIR / "isic_metadata.csv"

# -------------------------------------------------
# Read CSVs
# -------------------------------------------------

gt = pd.read_csv(GROUND_TRUTH)
meta = pd.read_csv(METADATA)

print("Ground Truth Samples :", len(gt))
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
# Merge Metadata + Labels
# -------------------------------------------------

df = meta.merge(
    gt[["image", "label"]],
    on="image",
)

# -------------------------------------------------
# Build Master Metadata
# -------------------------------------------------

master = pd.DataFrame()

master["image_path"] = df["image"].apply(
    lambda x: str(
        ISIC_DIR /
        "ISIC_2019_Training_Input" /
        f"{x}.jpg"
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
# Save
# -------------------------------------------------

master.to_csv(
    OUTPUT_FILE,
    index=False,
)

print("=" * 60)
print("ISIC Metadata Created")
print("=" * 60)

print(master.head())

print()

print("Saved To :")
print(OUTPUT_FILE)

print()

print("Total Samples :", len(master))