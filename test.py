import pandas as pd

df = pd.read_csv("dataset/metadata/HAM10000_metadata.csv")

print(df[df["image_id"] == "ISIC_0024306"])