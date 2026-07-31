# HAM10000 Dataset

## Overview

The HAM10000 (Human Against Machine with 10000 Training Images) dataset is a large collection of dermatoscopic images used for automated skin lesion classification. It is one of the most widely used benchmark datasets for skin disease diagnosis using deep learning.

This dataset serves as the primary image dataset for the DermaAI project.

---

## Dataset Source

- Official Dataset Name: HAM10000
- Full Name: Human Against Machine with 10000 Training Images
- Source: Kaggle
- Domain: Medical Imaging (Dermatology)

---

## Dataset Statistics

- Total Images: 10,015
- Image Format: JPG
- Metadata File: HAM10000_metadata.csv
- Number of Classes: 7

---

## Disease Classes

| Abbreviation | Disease |
|--------------|--------------------------------------------|
| akiec | Actinic Keratoses and Intraepithelial Carcinoma |
| bcc | Basal Cell Carcinoma |
| bkl | Benign Keratosis-like Lesions |
| df | Dermatofibroma |
| mel | Melanoma |
| nv | Melanocytic Nevi |
| vasc | Vascular Lesions |

---

## Metadata Fields

The metadata file contains patient and lesion information such as:

- Image ID
- Lesion ID
- Diagnosis
- Age
- Sex
- Anatomical Location

---

## Project Usage

This dataset will be used for:

- Image Classification
- Transfer Learning using EfficientNet-B0
- Explainable AI using Grad-CAM
- Feature Fusion with Patient Metadata
- Intelligent Decision Support

---

## Folder Structure

dataset/

├── images/

├── metadata/

│   └── HAM10000_metadata.csv

├── segmentations/

└── README.md

---

## Notes

The HAM10000 dataset provides dermatoscopic images along with patient metadata. Additional structured inputs such as symptoms and medical history will be incorporated later in the project to support multimodal learning.