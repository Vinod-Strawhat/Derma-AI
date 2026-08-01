import time
from pathlib import Path

from data.dataset import HAM10000Dataset
from preprocessing.image_preprocessing import get_train_transforms

PROJECT_ROOT = Path(__file__).resolve().parent.parent

dataset = HAM10000Dataset(
    metadata_path=PROJECT_ROOT / "dataset" / "metadata" / "HAM10000_metadata.csv",
    image_dir=PROJECT_ROOT / "dataset" / "images",
    transforms=get_train_transforms(),
)

start = time.time()

image, label = dataset[0]

print("Loaded first image")
print(image.shape)
print(label)

print(f"Time: {time.time() - start:.2f} seconds")