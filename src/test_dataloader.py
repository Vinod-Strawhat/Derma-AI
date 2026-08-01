from pathlib import Path

from data.dataset import HAM10000Dataset
from data.dataloader import get_train_dataloader
from preprocessing.image_preprocessing import get_train_transforms


PROJECT_ROOT = Path(__file__).resolve().parent.parent

METADATA_PATH = PROJECT_ROOT / "dataset" / "metadata" / "HAM10000_metadata.csv"
IMAGE_DIR = PROJECT_ROOT / "dataset" / "images"


dataset = HAM10000Dataset(
    metadata_path=METADATA_PATH,
    image_dir=IMAGE_DIR,
    transforms=get_train_transforms(),
)

train_loader = get_train_dataloader(
    dataset=dataset,
    batch_size=32,
)

print("=" * 60)
print("DermaAI DataLoader Test")
print("=" * 60)

print(f"Dataset Size : {len(dataset)}")
print(f"Number of Batches : {len(train_loader)}")

images, labels = next(iter(train_loader))

print("\nFirst Batch Information")
print("-" * 60)

print(f"Images Shape : {images.shape}")
print(f"Labels Shape : {labels.shape}")

print(f"Image Tensor Type : {type(images)}")
print(f"Label Tensor Type : {type(labels)}")

print(f"\nFirst 10 Labels : {labels[:10]}")