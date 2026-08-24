from pathlib import Path

from src.data.dataset import SkinDiseaseDataset


# --------------------------------------------------
# Dataset
# --------------------------------------------------

dataset = SkinDiseaseDataset(
    metadata_path=Path(
        "datasets/merged/master_metadata.csv"
    )
)


# --------------------------------------------------
# Dataset Size
# --------------------------------------------------

print("\nTotal Samples:", len(dataset))


# --------------------------------------------------
# Test First Sample
# --------------------------------------------------

image, age, gender, region, label = dataset[0]


print("\nFirst Sample")
print("-" * 40)

print("Age:", age)
print("Gender:", gender)
print("Region:", region)
print("Label:", label)

print("Image Type:", type(image))

if hasattr(image, "shape"):
    print("Image Shape:", image.shape)
else:
    print("Image Size:", image.size)