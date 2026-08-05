from pathlib import Path
import pandas as pd

# -------------------------------------------------
# Paths
# -------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

PAD_DIR = BASE_DIR / "datasets" / "PAD-UFES-20"

PAD_METADATA = PAD_DIR / "metadata.csv"

OUTPUT_DIR = BASE_DIR / "datasets" / "merged"
OUTPUT_DIR.mkdir(exist_ok=True)

OUTPUT_FILE = OUTPUT_DIR / "pad_metadata.csv"

# -------------------------------------------------
# Read Metadata
# -------------------------------------------------

pad = pd.read_csv(PAD_METADATA)

print(f"Original Samples : {len(pad)}")

# -------------------------------------------------
# Label Mapping
# -------------------------------------------------

label_map = {
    "ACK": "Actinic Keratosis",
    "BCC": "Basal Cell Carcinoma",
    "MEL": "Melanoma",
    "NEV": "Melanocytic Nevus",
    "SEK": "Benign Keratosis",
    "SCC": "Squamous Cell Carcinoma",
}

# -------------------------------------------------
# Build Master Metadata
# -------------------------------------------------

master = pd.DataFrame()

master["image_path"] = pad["img_id"].apply(
    lambda x: str(PAD_DIR / "images" / x)
)

master["dataset"] = "PAD-UFES"

master["age"] = pad["age"]

master["gender"] = (
    pad["gender"]
    .fillna("Unknown")
    .astype(str)
    .str.capitalize()
)

master["region"] = (
    pad["region"]
    .fillna("Unknown")
    .astype(str)
)

master["label"] = (
    pad["diagnostic"]
    .map(label_map)
)

# -------------------------------------------------
# Save
# -------------------------------------------------

master.to_csv(OUTPUT_FILE, index=False)

print("=" * 50)
print("PAD-UFES Metadata Created")
print("=" * 50)

print(master.head())

print(f"\nSaved to:\n{OUTPUT_FILE}")

print(f"\nTotal Samples : {len(master)}")