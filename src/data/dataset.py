"""
PyTorch Dataset implementation for the HAM10000 dataset.

This module provides a reusable Dataset class that loads skin lesion
images along with their labels and applies preprocessing transforms.
"""

from pathlib import Path

import pandas as pd
from PIL import Image
from torch import Tensor
from torch.utils.data import Dataset


class HAM10000Dataset(Dataset):
    """
    PyTorch Dataset for the HAM10000 skin lesion dataset.
    """

    LABEL_MAPPING = {
        "akiec": 0,
        "bcc": 1,
        "bkl": 2,
        "df": 3,
        "mel": 4,
        "nv": 5,
        "vasc": 6,
    }

    def __init__(
        self,
        metadata_path: Path,
        image_dir: Path,
        transforms=None,
    ) -> None:
        """
        Initialize the dataset.

        Args:
            metadata_path: Path to HAM10000_metadata.csv
            image_dir: Directory containing all images
            transforms: Optional torchvision transforms
        """

        self.metadata = pd.read_csv(metadata_path)
        self.image_dir = Path(image_dir)
        self.transforms = transforms

    def __len__(self) -> int:
        """
        Return the total number of samples.
        """
        return len(self.metadata)

    def __getitem__(self, index: int) -> tuple[Tensor, int]:
        """
        Return one image and its corresponding label.

        Args:
            index: Index of the sample.

        Returns:
            Tuple containing:
                image tensor
                numeric label
        """

        row = self.metadata.iloc[index]

        image_id = row["image_id"]
        diagnosis = row["dx"]

        image_path = self.image_dir / f"{image_id}.jpg"

        if not image_path.exists():
            raise FileNotFoundError(
                f"Image not found: {image_path}"
            )

        image = Image.open(image_path).convert("RGB")

        if self.transforms is not None:
            image = self.transforms(image)

        label = self.LABEL_MAPPING[diagnosis]

        return image, label