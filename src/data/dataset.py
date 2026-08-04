"""
Universal PyTorch Dataset for DermaAI Version 2.

Loads images from multiple datasets using master_metadata.csv
and returns image + metadata for multimodal learning.
"""

from pathlib import Path

import pandas as pd
from PIL import Image
from torch import Tensor
from torch.utils.data import Dataset


class SkinDiseaseDataset(Dataset):

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
        ham_image_dir: Path,
        pad_image_dir: Path,
        transforms=None,
    ):

        self.metadata = pd.read_csv(metadata_path)

        self.ham_image_dir = Path(ham_image_dir)
        self.pad_image_dir = Path(pad_image_dir)

        self.transforms = transforms

        # Gender Encoding
        self.gender_mapping = {
            "Male": 0,
            "Female": 1,
        }

        # Region Encoding
        regions = sorted(self.metadata["region"].dropna().unique())
        self.region_mapping = {
            region: idx for idx, region in enumerate(regions)
        }

    def __len__(self):

        return len(self.metadata)

    def __getitem__(self, index):

        row = self.metadata.iloc[index]

        filename = row["filename"]
        dataset = row["dataset"]

        if dataset == "HAM10000":
            image_path = self.ham_image_dir / filename
        elif dataset == "PAD-UFES":
            image_path = self.pad_image_dir / filename
        else:
            raise ValueError(f"Unknown dataset: {dataset}")

        if not image_path.exists():
            raise FileNotFoundError(
                f"Image not found: {image_path}"
            )

        with Image.open(image_path) as img:
            image = img.convert("RGB")

        if self.transforms:
            image = self.transforms(image)

        # -------- Metadata -------- #

        age = row["age"]

        if pd.isna(age):
            age = 0

        age = float(age)

        gender = row["gender"]

        if gender in self.gender_mapping:
            gender = self.gender_mapping[gender]
        else:
            gender = 0

        region = row["region"]

        if region in self.region_mapping:
            region = self.region_mapping[region]
        else:
            region = 0

        label = self.LABEL_MAPPING[row["label"]]

        return (
            image,
            age,
            gender,
            region,
            label,
        )