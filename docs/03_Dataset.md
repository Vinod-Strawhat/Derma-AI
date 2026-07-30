# Dataset Documentation

## Project Name

**DermaAI – Explainable Multimodal AI for Skin Disease Diagnosis and Intelligent Decision Support**

---

# Purpose

This document describes the dataset used for training and evaluating the DermaAI system. It includes dataset information, structure, preprocessing steps, and how the data integrates into the overall AI pipeline.

---

# Dataset Overview

DermaAI uses the **HAM10000 (Human Against Machine with 10,000 Training Images)** dataset as the primary image dataset for skin disease classification.

The dataset contains dermatoscopic images of common pigmented skin lesions collected from different populations and medical institutions.

---

# Dataset Details

| Attribute | Value |
|----------|---------|
| Dataset Name | HAM10000 |
| Domain | Healthcare |
| Task | Skin Disease Classification |
| Image Format | JPG |
| Number of Images | Approximately 10,015 |
| Number of Classes | 7 |
| Image Type | Dermatoscopic Images |

---

# Disease Classes

The dataset contains the following seven skin disease categories:

| Abbreviation | Disease Name |
|--------------|--------------|
| akiec | Actinic Keratoses and Intraepithelial Carcinoma |
| bcc | Basal Cell Carcinoma |
| bkl | Benign Keratosis-like Lesions |
| df | Dermatofibroma |
| mel | Melanoma |
| nv | Melanocytic Nevi |
| vasc | Vascular Lesions |

---

# Dataset Directory Structure

```
dataset/
│
├── HAM10000_images_part_1/
├── HAM10000_images_part_2/
├── HAM10000_metadata.csv
└── README.md
```

---

# Metadata

The metadata file contains additional information about each image.

Important fields include:

- Image ID
- Diagnosis
- Age
- Sex
- Anatomical Site

This metadata will support future multimodal integration in DermaAI.

---

# Data Preprocessing Pipeline

Before training, the dataset undergoes several preprocessing steps.

## Image Processing

- Resize images to model input size
- Normalize pixel values
- Convert images into tensors
- Apply data augmentation
- Remove corrupted images

---

## Data Splitting

The dataset will be divided into:

- Training Set
- Validation Set
- Test Set

This helps evaluate the model's generalization performance.

---

# Data Augmentation

To improve model robustness, the following augmentation techniques will be used:

- Random Horizontal Flip
- Random Vertical Flip
- Random Rotation
- Random Zoom
- Random Brightness Adjustment

These transformations increase dataset diversity and help reduce overfitting.

---

# Role in DermaAI

The HAM10000 dataset forms the foundation of the image analysis module.

The extracted image features will later be combined with:

- Patient symptoms
- Age
- Gender
- Medical history

to build the complete multimodal AI system.

---

# Current Scope

### Phase 1

- HAM10000 image dataset
- Image classification
- Grad-CAM visualization

### Phase 2

- Integration of clinical information
- Multimodal feature fusion
- SHAP explanations
- Intelligent decision support

---

# Future Dataset Expansion

Future versions of DermaAI may include:

- Additional public skin disease datasets
- Clinical text datasets
- Electronic Health Record (EHR) data
- Real-world patient data (subject to ethical approval)

---

# Summary

The HAM10000 dataset provides a high-quality benchmark for developing the image classification component of DermaAI. Its associated metadata also supports future expansion toward a multimodal AI system capable of combining visual and clinical information for more informed diagnostic assistance.