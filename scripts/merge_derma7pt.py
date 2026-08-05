from pathlib import Path
import pandas as pd

# -------------------------------------------------
# Paths
# -------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

DERMA_DIR = (
    BASE_DIR
    / "datasets"
    / "Derma7pt"
    / "release_v0"
)

META = DERMA_DIR / "meta" / "meta.csv"

OUTPUT_DIR = BASE_DIR / "datasets" / "merged"
OUTPUT_DIR.mkdir(exist_ok=True)

OUTPUT_FILE = OUTPUT_DIR / "derma7pt_metadata.csv"

# -------------------------------------------------
# Read Metadata
# -------------------------------------------------

df = pd.read_csv(META)

print("Original Samples :", len(df))

# -------------------------------------------------
# Label Mapping
# -------------------------------------------------

label_map = {
    "basal cell carcinoma": "Basal Cell Carcinoma",
    "blue nevus": "Melanocytic Nevus",
    "clark nevus": "Melanocytic Nevus",
    "combined nevus": "Melanocytic Nevus",
    "congenital nevus": "Melanocytic Nevus",
    "dermal nevus": "Melanocytic Nevus",
    "melanoma": "Melanoma",
    "melanosis": "Benign Keratosis",
    "recurrent nevus": "Melanocytic Nevus",
    "reed or spitz nevus": "Melanocytic Nevus",
    "seborrheic keratosis": "Benign Keratosis",
    "vascular lesion": "Vascular Lesion",
    "dermatofibroma": "Dermatofibroma",
}

# -------------------------------------------------
# Build Master Metadata
# -------------------------------------------------

master = pd.DataFrame()

master["image_path"] = df["derm"].apply(
    lambda x: str(
        DERMA_DIR /
        "images" /
        x
    )
)

master["dataset"] = "Derm7pt"

master["age"] = None

master["gender"] = (
    df["sex"]
    .fillna("Unknown")
    .astype(str)
    .str.capitalize()
)

master["region"] = (
    df["location"]
    .fillna("Unknown")
)

master["label"] = (
    df["diagnosis"]
    .str.lower()
    .map(label_map)
)

master = master.dropna(subset=["label"])

# -------------------------------------------------
# Save
# -------------------------------------------------

master.to_csv(
    OUTPUT_FILE,
    index=False,
)

print("=" * 60)
print("Derm7pt Metadata Created")
print("=" * 60)

print(master.head())

print()

print("Saved To :")
print(OUTPUT_FILE)

print()

print("Total Samples :", len(master))