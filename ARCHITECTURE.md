# DermaAI - System Architecture

## Project Overview

DermaAI is an Explainable Multimodal AI System for Skin Disease Diagnosis and Intelligent Decision Support.

The objective is to develop a production-quality AI application capable of predicting skin diseases using dermatoscopic images and patient metadata while providing explainable predictions for users and healthcare professionals.

---

# Current Development Stage

Current Phase:

Project Setup Completed ✅

Current Task:

Dataset Exploration (EDA)

---

# Technology Stack

Programming Language
- Python

Deep Learning
- PyTorch
- TorchVision

Computer Vision
- OpenCV

Data Analysis
- Pandas
- NumPy
- Matplotlib

Machine Learning
- Scikit-learn

Explainable AI
- Grad-CAM
- SHAP

Frontend
- Streamlit

Version Control
- Git
- GitHub

Development Environment
- Cursor IDE
- Python Virtual Environment (.venv)

---

# Dataset

Primary Dataset

HAM10000

Folder Structure

dataset/

    images/

    metadata/

        HAM10000_metadata.csv

Dataset files remain local and are ignored by Git.

---

# Planned Folder Structure

src/

    data/

    preprocessing/

    models/

    training/

    evaluation/

    explainability/

    utils/

app/

dataset/

docs/

models/

---

# Machine Learning Pipeline

Dataset

↓

Exploratory Data Analysis

↓

Image Preprocessing

↓

Dataset Loader

↓

Train / Validation Split

↓

EfficientNet-B0

↓

Model Training

↓

Model Evaluation

↓

Explainability (Grad-CAM)

↓

Prediction Pipeline

↓

Streamlit Web Application

↓

Deployment

---

# Development Workflow

Architecture Design
(ChatGPT)

↓

Implementation
(Cursor)

↓

Execution & Testing
(Vinod)

↓

Debugging
(ChatGPT + Cursor)

↓

Git Commit

↓

Git Push

---

# Coding Principles

- Modular code
- Reusable functions
- Clean architecture
- Production-ready code
- PEP8 compliance
- Type hints where appropriate
- No unnecessary files
- No duplicate code
- No hardcoded dataset paths

---

# Git Workflow

Every completed module:

1. Test
2. Git Add
3. Commit
4. Push

Meaningful commit messages only.

---

# Module Roadmap

Phase 1

- explore_dataset.py
- image_preprocessing.py
- dataset.py
- dataloader.py

Phase 2

- efficientnet_model.py
- train.py
- evaluate.py

Phase 3

- gradcam.py
- predict.py

Phase 4

- app.py

Phase 5

- deployment

---

# Completed

- Repository initialized
- Folder structure
- Documentation
- Python environment
- Dependency installation
- Dataset organization
- Git configuration
- Cursor project configuration

---

# Next Module

explore_dataset.py

Purpose:

Understand the HAM10000 dataset before any preprocessing or model development.

Status:

Ready for implementation.