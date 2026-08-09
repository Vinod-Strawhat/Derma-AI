"""
Universal PyTorch Dataset for DermaAI Version 2.

Loads images from the unified master_metadata.csv and returns
image + metadata + label for multimodal learning.
"""

from pathlib import Path

import pandas as pd
import torch
from PIL import Image
from torch.utils.data import Dataset


class SkinDiseaseDataset(Dataset):

    # --------------------------------------------------
    # Disease Label Mapping
    # --------------------------------------------------

    LABEL_MAPPING = {
        "Actinic Keratosis": 0,
        "Basal Cell Carcinoma": 1,
        "Benign Keratosis": 2,
        "Dermatofibroma": 3,
        "Melanoma": 4,
        "Melanocytic Nevus": 5,
        "Squamous Cell Carcinoma": 6,
        "Vascular Lesion": 7,
    }

    def __init__(
        self,
        metadata_path: Path,
        transforms=None,
    ):
        """
        Args:
            metadata_path:
                Path to master_metadata.csv.

            transforms:
                torchvision image transformations.
        """

        # --------------------------------------------------
        # Load Metadata
        # --------------------------------------------------

        self.metadata_path = Path(metadata_path)

        if not self.metadata_path.exists():
            raise FileNotFoundError(
                f"Metadata file not found: {self.metadata_path}"
            )

        self.metadata = pd.read_csv(self.metadata_path)

        # --------------------------------------------------
        # Check Required Columns
        # --------------------------------------------------

        required_columns = [
            "image_path",
            "dataset",
            "age",
            "gender",
            "region",
            "label",
        ]

        missing_columns = [
            column
            for column in required_columns
            if column not in self.metadata.columns
        ]

        if missing_columns:
            raise ValueError(
                f"Missing columns in metadata: {missing_columns}"
            )

        # --------------------------------------------------
        # Image Transforms
        # --------------------------------------------------

        self.transforms = transforms

        # --------------------------------------------------
        # Gender Encoding
        # --------------------------------------------------

        self.gender_mapping = {
            "Male": 0,
            "Female": 1,
            "Unknown": 2,
        }

        # --------------------------------------------------
        # Region Encoding
        # --------------------------------------------------

        self.metadata["region"] = (
            self.metadata["region"]
            .fillna("Unknown")
            .astype(str)
        )

        regions = sorted(
            self.metadata["region"].unique()
        )

        self.region_mapping = {
            region: index
            for index, region in enumerate(regions)
        }

        # Unknown region index
        self.unknown_region_index = len(
            self.region_mapping
        )

        # --------------------------------------------------
        # Clean Gender
        # --------------------------------------------------

        self.metadata["gender"] = (
            self.metadata["gender"]
            .fillna("Unknown")
            .astype(str)
            .str.capitalize()
        )

        # --------------------------------------------------
        # Clean Labels
        # --------------------------------------------------

        invalid_labels = set(
            self.metadata["label"].dropna().unique()
        ) - set(self.LABEL_MAPPING.keys())

        if invalid_labels:
            raise ValueError(
                f"Unknown labels found in metadata: "
                f"{invalid_labels}"
            )

        # --------------------------------------------------
        # Print Dataset Information
        # --------------------------------------------------

        print("=" * 60)
        print("SkinDiseaseDataset Initialized")
        print("=" * 60)

        print(f"Metadata File : {self.metadata_path}")
        print(f"Total Samples : {len(self.metadata)}")
        print(f"Number of Classes : {len(self.LABEL_MAPPING)}")

        print("\nDataset Distribution:")
        print(
            self.metadata["dataset"]
            .value_counts()
        )

        print("\nLabel Distribution:")
        print(
            self.metadata["label"]
            .value_counts()
        )

    # --------------------------------------------------
    # Dataset Length
    # --------------------------------------------------

    def __len__(self):
        return len(self.metadata)

    # --------------------------------------------------
    # Load Image Path
    # --------------------------------------------------

    def _get_image_path(self, image_path):
        """
        Convert the image_path stored in CSV into
        a valid Path object.
        """

        image_path = Path(str(image_path))

        # Absolute path
        if image_path.is_absolute():
            return image_path

        # Relative path
        project_root = self.metadata_path.resolve().parents[2]

        return project_root / image_path

    # --------------------------------------------------
    # Get One Sample
    # --------------------------------------------------

    def __getitem__(self, index):

        row = self.metadata.iloc[index]

        # --------------------------------------------------
        # Image
        # --------------------------------------------------

        image_path = self._get_image_path(
            row["image_path"]
        )

        if not image_path.exists():
            raise FileNotFoundError(
                f"Image not found:\n{image_path}"
            )

        try:
            with Image.open(image_path) as img:
                image = img.convert("RGB")

        except Exception as error:
            raise RuntimeError(
                f"Could not open image:\n"
                f"{image_path}\n"
                f"Error: {error}"
            )

        # --------------------------------------------------
        # Image Transform
        # --------------------------------------------------

        if self.transforms is not None:
            image = self.transforms(image)

        # --------------------------------------------------
        # Age
        # --------------------------------------------------

        age = row["age"]

        if pd.isna(age):
            age = 0.0

        age = float(age)

        # --------------------------------------------------
        # Gender
        # --------------------------------------------------

        gender = row["gender"]

        if gender in self.gender_mapping:
            gender = self.gender_mapping[gender]
        else:
            gender = self.gender_mapping["Unknown"]

        # --------------------------------------------------
        # Region
        # --------------------------------------------------

        region = row["region"]

        if region in self.region_mapping:
            region = self.region_mapping[region]
        else:
            region = self.unknown_region_index

        # --------------------------------------------------
        # Disease Label
        # --------------------------------------------------

        label_name = row["label"]

        if label_name not in self.LABEL_MAPPING:
            raise ValueError(
                f"Unknown disease label: {label_name}"
            )

        label = self.LABEL_MAPPING[label_name]

        # --------------------------------------------------
        # Convert Metadata to Tensors
        # --------------------------------------------------

        age = torch.tensor(
            age,
            dtype=torch.float32,
        )

        gender = torch.tensor(
            gender,
            dtype=torch.long,
        )

        region = torch.tensor(
            region,
            dtype=torch.long,
        )

        label = torch.tensor(
            label,
            dtype=torch.long,
        )

        # --------------------------------------------------
        # Return
        # --------------------------------------------------

        return (
            image,
            age,
            gender,
            region,
            label,
        )