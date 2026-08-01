from pathlib import Path

from data.dataset import HAM10000Dataset
from preprocessing.image_preprocessing import get_validation_transforms


PROJECT_ROOT = Path(__file__).resolve().parent.parent

METADATA_PATH = PROJECT_ROOT / "dataset" / "metadata" / "HAM10000_metadata.csv"

IMAGE_DIR = PROJECT_ROOT / "dataset" / "images"


dataset = HAM10000Dataset(
    metadata_path=METADATA_PATH,
    image_dir=IMAGE_DIR,
    transforms=get_validation_transforms(),
)

print("=" * 50)
print("Dataset Test")
print("=" * 50)

print(f"Dataset Size: {len(dataset)}")

image, label = dataset[0]

print(f"Image Shape : {image.shape}")
print(f"Image Type  : {type(image)}")
print(f"Label       : {label}")