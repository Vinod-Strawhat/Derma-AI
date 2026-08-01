from pathlib import Path

from data.dataset import HAM10000Dataset
from data.dataloader import get_train_dataloader
from preprocessing.image_preprocessing import get_train_transforms

PROJECT_ROOT = Path(__file__).resolve().parent.parent

dataset = HAM10000Dataset(
    metadata_path=PROJECT_ROOT / "dataset" / "metadata" / "HAM10000_metadata.csv",
    image_dir=PROJECT_ROOT / "dataset" / "images",
    transforms=get_train_transforms(),
)

loader = get_train_dataloader(dataset)

print("Before first batch")

images, labels = next(iter(loader))

print("After first batch")

print(images.shape)
print(labels.shape)