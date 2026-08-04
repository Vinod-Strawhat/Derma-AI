import pandas as pd
from pathlib import Path

# ==============================
# Project Paths
# ==============================

BASE_DIR = Path(__file__).resolve().parent.parent

HAM_METADATA = BASE_DIR / "HAM-10000" / "HAM10000_metadata.csv"
PAD_METADATA = BASE_DIR / "PAD-UFES-20" / "metadata.csv"

OUTPUT_DIR = BASE_DIR / "merged"
OUTPUT_DIR.mkdir(exist_ok=True)

OUTPUT_FILE = OUTPUT_DIR / "master_metadata.csv"

print("Project Directory :", BASE_DIR)
print("HAM Metadata      :", HAM_METADATA)
print("PAD Metadata      :", PAD_METADATA)
print("Output File       :", OUTPUT_FILE)

# ==============================
# Read Metadata
# ==============================

ham_df = pd.read_csv(HAM_METADATA)
pad_df = pd.read_csv(PAD_METADATA)

print("\nHAM10000")
print(ham_df.head())

print("\nPAD-UFES")
print(pad_df.head())

# ==============================
# Select Required Columns
# ==============================

ham_df = ham_df[
    [
        "image_id",
        "age",
        "sex",
        "localization",
        "dx",
    ]
]

pad_df = pad_df[
    [
        "img_id",
        "age",
        "gender",
        "region",
        "diagnostic",
    ]
]
# ==============================
# Rename Columns
# ==============================

ham_df.rename(
    columns={
        "image_id": "image_id",
        "age": "age",
        "sex": "gender",
        "localization": "region",
        "dx": "label",
    },
    inplace=True,
)

pad_df.rename(
    columns={
        "img_id": "image_id",
        "age": "age",
        "gender": "gender",
        "region": "region",
        "diagnostic": "label",
    },
    inplace=True,
)
# ==============================
# Add Dataset Name
# ==============================

ham_df["dataset"] = "HAM10000"
pad_df["dataset"] = "PAD-UFES"
# ==============================
# Create Filename Column
# ==============================

ham_df["filename"] = ham_df["image_id"] + ".jpg"

pad_df["filename"] = pad_df["image_id"]
# ==============================
# Disease Label Mapping
# ==============================

ham_label_map = {
    "akiec": "Actinic Keratosis",
    "bcc": "Basal Cell Carcinoma",
    "bkl": "Benign Keratosis",
    "df": "Dermatofibroma",
    "mel": "Melanoma",
    "nv": "Melanocytic Nevus",
    "vasc": "Vascular Lesion",
}

pad_label_map = {
    "ACK": "Actinic Keratosis",
    "BCC": "Basal Cell Carcinoma",
    "MEL": "Melanoma",
    "NEV": "Melanocytic Nevus",
    "SEK": "Benign Keratosis",
    "SCC": "Squamous Cell Carcinoma",
}

ham_df["label"] = ham_df["label"].map(ham_label_map)
pad_df["label"] = pad_df["label"].map(pad_label_map)
# ==============================
# Standardize Gender
# ==============================

ham_df["gender"] = ham_df["gender"].str.capitalize()
pad_df["gender"] = pad_df["gender"].str.capitalize()
# ==============================
# Final Columns
# ==============================

columns = [
    "image_id",
    "filename",
    "dataset",
    "age",
    "gender",
    "region",
    "label",
]

ham_df = ham_df[columns]
pad_df = pad_df[columns]
# ==============================
# Merge DataFrames
# ==============================

master_df = pd.concat(
    [ham_df, pad_df],
    ignore_index=True,
)
# ==============================
# Save Master Metadata
# ==============================

master_df.to_csv(OUTPUT_FILE, index=False)

print("\n===================================")
print(" Merge Successful!")
print("===================================")

print(f"Total Samples : {len(master_df)}")
print(f"Saved To      : {OUTPUT_FILE}")

print("\nFirst 5 Rows\n")
print(master_df.head())