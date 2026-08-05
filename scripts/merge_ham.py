from pathlib import Path
import pandas as pd

# -------------------------------------------------
# Paths
# -------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

HAM_DIR = BASE_DIR / "datasets" / "HAM-10000"

HAM_METADATA = HAM_DIR / "HAM10000_metadata.csv"

OUTPUT_DIR = BASE_DIR / "datasets" / "merged"
OUTPUT_DIR.mkdir(exist_ok=True)

OUTPUT_FILE = OUTPUT_DIR / "ham_metadata.csv"

# -------------------------------------------------
# Read Metadata
# -------------------------------------------------

ham = pd.read_csv(HAM_METADATA)

print(f"Original Samples : {len(ham)}")

# -------------------------------------------------
# Label Mapping
# -------------------------------------------------

label_map = {
    "akiec": "Actinic Keratosis",
    "bcc": "Basal Cell Carcinoma",
    "bkl": "Benign Keratosis",
    "df": "Dermatofibroma",
    "mel": "Melanoma",
    "nv": "Melanocytic Nevus",
    "vasc": "Vascular Lesion",
}

# -------------------------------------------------
# Build Master Metadata
# -------------------------------------------------

master = pd.DataFrame()

master["image_path"] = ham["image_id"].apply(
    lambda x: str(HAM_DIR / "images" / f"{x}.jpg")
)

master["dataset"] = "HAM10000"

master["age"] = ham["age"]

master["gender"] = ham["sex"].fillna("Unknown").str.capitalize()

master["region"] = ham["localization"].fillna("Unknown")

master["label"] = ham["dx"].map(label_map)

# -------------------------------------------------
# Save
# -------------------------------------------------

master.to_csv(OUTPUT_FILE, index=False)

print("=" * 50)
print("HAM10000 Metadata Created")
print("=" * 50)

print(master.head())

print(f"\nSaved to:\n{OUTPUT_FILE}")

print(f"\nTotal Samples : {len(master)}")