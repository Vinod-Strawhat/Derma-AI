from pathlib import Path
import pandas as pd

# -------------------------------------------------
# Paths
# -------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

MERGED_DIR = BASE_DIR / "datasets" / "merged"

HAM = MERGED_DIR / "ham_metadata.csv"
PAD = MERGED_DIR / "pad_metadata.csv"
ISIC = MERGED_DIR / "isic_metadata.csv"
DERMA = MERGED_DIR / "derma7pt_metadata.csv"

OUTPUT = MERGED_DIR / "master_metadata.csv"

# -------------------------------------------------
# Read Files
# -------------------------------------------------

ham = pd.read_csv(HAM)
pad = pd.read_csv(PAD)
isic = pd.read_csv(ISIC)
derma = pd.read_csv(DERMA)

print("HAM      :", len(ham))
print("PAD      :", len(pad))
print("ISIC     :", len(isic))
print("DERMA7PT :", len(derma))

# -------------------------------------------------
# Merge
# -------------------------------------------------

master = pd.concat(
    [
        ham,
        pad,
        isic,
        derma,
    ],
    ignore_index=True,
)

# -------------------------------------------------
# Remove Duplicate Image Paths
# -------------------------------------------------

master = master.drop_duplicates(
    subset=["image_path"]
)

# -------------------------------------------------
# Standardize Missing Values
# -------------------------------------------------

master["age"] = pd.to_numeric(
    master["age"],
    errors="coerce",
)

master["gender"] = (
    master["gender"]
    .fillna("Unknown")
)

master["region"] = (
    master["region"]
    .fillna("Unknown")
)

master["label"] = (
    master["label"]
    .fillna("Unknown")
)

# -------------------------------------------------
# Save
# -------------------------------------------------

master.to_csv(
    OUTPUT,
    index=False,
)

print("\n" + "=" * 60)
print("MASTER DATASET CREATED")
print("=" * 60)

print()

print(master.head())

print()

print("Saved To:")
print(OUTPUT)

print()

print("TOTAL IMAGES :", len(master))

print()

print("Label Distribution\n")

print(master["label"].value_counts())