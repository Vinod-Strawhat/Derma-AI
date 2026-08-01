"""
Exploratory Data Analysis (EDA) for the HAM10000 dataset.

This script loads the dataset metadata and displays basic structural
information to understand the data before preprocessing or modeling.
"""

from pathlib import Path

import pandas as pd

# Project root is one level above the src/ directory.
PROJECT_ROOT = Path(__file__).resolve().parent.parent

# Metadata file path built dynamically using pathlib.
METADATA_PATH = PROJECT_ROOT / "dataset" / "metadata" / "HAM10000_metadata.csv"

# Project title displayed at the start of the analysis.
PROJECT_TITLE = "DermaAI - HAM10000 Dataset Exploration"


def load_metadata(metadata_path: Path) -> pd.DataFrame:
    """
    Load the HAM10000 metadata CSV into a pandas DataFrame.

    Args:
        metadata_path: Path to the HAM10000_metadata.csv file.

    Returns:
        DataFrame containing the dataset metadata.

    Raises:
        FileNotFoundError: If the metadata file does not exist.
    """
    if not metadata_path.exists():
        raise FileNotFoundError(
            f"Metadata file not found at: {metadata_path}"
        )

    return pd.read_csv(metadata_path)


def main() -> None:
    """Run the first stage of exploratory data analysis on HAM10000 metadata."""
    # Load metadata into the primary DataFrame used throughout this script.
    df = load_metadata(METADATA_PATH)

    # --- Basic dataset overview ---
    header_line = "=" * len(PROJECT_TITLE)
    print(header_line)
    print(PROJECT_TITLE)
    print(header_line)
    print("Dataset loaded successfully")
    print(f"Number of rows: {df.shape[0]}")
    print(f"Number of columns: {df.shape[1]}")
    print()

    # --- Preview first and last records ---
    print("First five rows:")
    print(df.head().to_string())
    print()

    print("Last five rows:")
    print(df.tail().to_string())
    print()

    # --- Column structure and data types ---
    print("Column names:")
    for column in df.columns:
        print(column)
    print()

    print("DataFrame information:")
    df.info()
    print()

    print("Data types:")
    print(df.dtypes)
    print()

    # --- Data quality checks ---
    print("Missing values:")
    print(df.isnull().sum())
    print()

    print(f"Duplicate row count: {df.duplicated().sum()}")
    print()

    # --- Disease class analysis ---
    print("Unique disease classes:")
    for disease_class in df["dx"].unique():
        print(disease_class)
    print()

    print("Class distribution:")
    print(df["dx"].value_counts())


if __name__ == "__main__":
    main()
