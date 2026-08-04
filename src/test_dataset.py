from pathlib import Path

from src.data.dataset import SkinDiseaseDataset

dataset = SkinDiseaseDataset(
    metadata_path=Path("datasets/merged/master_metadata.csv"),
    ham_image_dir=Path("datasets/HAM-10000/images"),
    pad_image_dir=Path("datasets/PAD-UFES-20/images"),
)

print("Total Samples:", len(dataset))

image, age, gender, region, label = dataset[0]

print("Age:", age)
print("Gender:", gender)
print("Region:", region)
print("Label:", label)
print("Image Shape:", image.size)