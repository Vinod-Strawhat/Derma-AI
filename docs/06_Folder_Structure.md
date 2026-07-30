# Folder Structure

## Project Name

**DermaAI – Explainable Multimodal AI for Skin Disease Diagnosis and Intelligent Decision Support**

---

# Purpose

This document defines the directory structure of the DermaAI project. A well-organized folder structure improves maintainability, scalability, and collaboration by separating source code, datasets, models, documentation, and application files.

---

# Project Directory Structure

```
Derma-AI/
│
├── docs/
│   ├── 01_Project_Overview.md
│   ├── 02_System_Architecture.md
│   ├── 03_Dataset.md
│   ├── 04_Model_Architecture.md
│   ├── 05_Website_Architecture.md
│   ├── 06_Folder_Structure.md
│   ├── 07_Coding_Standards.md
│   ├── 08_Task_Roadmap.md
│   ├── 09_AI_Master_Prompt.md
│   └── 10_Deployment.md
│
├── dataset/
│   ├── HAM10000_images_part_1/
│   ├── HAM10000_images_part_2/
│   ├── HAM10000_metadata.csv
│   └── README.md
│
├── models/
│   ├── checkpoints/
│   ├── trained_models/
│   └── README.md
│
├── src/
│   ├── data/
│   ├── preprocessing/
│   ├── training/
│   ├── inference/
│   ├── explainability/
│   ├── utils/
│   └── README.md
│
├── app/
│   ├── pages/
│   ├── assets/
│   ├── components/
│   └── app.py
│
├── requirements.txt
├── .gitignore
└── README.md
```

---

# Folder Description

## docs/

Contains all project documentation, including architecture, dataset details, development roadmap, and deployment information.

---

## dataset/

Stores datasets required for training and evaluation.

Contents include:

- Image datasets
- Metadata files
- Dataset documentation

---

## models/

Stores trained models and model checkpoints.

Contents include:

- Training checkpoints
- Final trained models
- Model weights

---

## src/

Contains the core source code of the AI system.

Subfolders:

### data/

Handles dataset loading and preparation.

### preprocessing/

Image preprocessing and data transformation.

### training/

Model training scripts.

### inference/

Prediction and model inference.

### explainability/

Implementation of Grad-CAM and SHAP.

### utils/

Utility functions shared across the project.

---

## app/

Contains the Streamlit web application.

Subfolders:

### pages/

Individual pages of the Streamlit application.

### assets/

Images, icons, and static resources.

### components/

Reusable UI components.

### app.py

Main entry point of the Streamlit application.

---

# Root Files

## README.md

Provides an overview of the project, installation instructions, and usage guide.

---

## requirements.txt

Lists all Python packages required to run the project.

---

## .gitignore

Specifies files and directories that should not be tracked by Git.

Examples include:

- Virtual environments
- Cache files
- Temporary files
- Model checkpoints (optional)

---

# Design Principles

The folder structure follows these principles:

- Separation of concerns
- Modular organization
- Scalability
- Maintainability
- Reusability
- Easy navigation

---

# Development Workflow

```
Dataset
    │
    ▼
Preprocessing
    │
    ▼
Training
    │
    ▼
Model
    │
    ▼
Inference
    │
    ▼
Explainability
    │
    ▼
Streamlit Application
```

---

# Future Expansion

The folder structure is designed to support future additions such as:

- Automated testing
- Configuration files
- Deployment scripts
- Docker support
- Cloud integration
- API services

These can be added without major changes to the existing project organization.

---

# Summary

The DermaAI folder structure provides a clean and modular organization for documentation, datasets, source code, trained models, and the Streamlit application. This layout supports efficient development, collaboration, and future expansion while maintaining a professional software engineering workflow.