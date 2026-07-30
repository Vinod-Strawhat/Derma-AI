# Deployment Guide

## Project Name

**DermaAI – Explainable Multimodal AI for Skin Disease Diagnosis and Intelligent Decision Support**

---

# Purpose

This document describes how to set up, run, and deploy the DermaAI project. It covers the development environment, dependency installation, local execution, project structure, and future deployment options.

---

# Deployment Objectives

The deployment process aims to:

- Prepare a consistent development environment.
- Install all required dependencies.
- Execute the AI model locally.
- Run the Streamlit web application.
- Enable future cloud deployment with minimal changes.

---

# System Requirements

## Hardware

Minimum Requirements:

- Intel Core i5 / AMD Ryzen 5
- 8 GB RAM
- 10 GB Free Storage

Recommended:

- Intel Core i7 / AMD Ryzen 7
- 16 GB RAM
- NVIDIA GPU (CUDA supported)
- SSD Storage

---

## Software

- Windows 10/11, Linux, or macOS
- Python 3.11+
- Git
- Visual Studio Code

---

# Project Setup

Clone the repository:

```bash
git clone https://github.com/Vinod-Strawhat/Derma-AI.git
```

Move into the project directory:

```bash
cd Derma-AI
```

---

# Create a Virtual Environment

Windows

```bash
python -m venv .venv
```

Linux / macOS

```bash
python3 -m venv .venv
```

Activate the virtual environment.

Windows

```bash
.venv\Scripts\activate
```

Linux / macOS

```bash
source .venv/bin/activate
```

---

# Install Dependencies

Install all required packages:

```bash
pip install -r requirements.txt
```

---

# Project Structure

```
Derma-AI/
│
├── docs/
├── dataset/
├── models/
├── src/
├── app/
├── requirements.txt
├── README.md
└── .gitignore
```

---

# Running the Project

## Phase 1

Train the image classification model.

Example:

```bash
python src/training/train_model.py
```

---

## Phase 2

Run the Streamlit application.

Example:

```bash
streamlit run app/app.py
```

---

# Expected Workflow

```
Clone Repository
        │
        ▼
Create Virtual Environment
        │
        ▼
Install Dependencies
        │
        ▼
Download Dataset
        │
        ▼
Train AI Model
        │
        ▼
Save Trained Model
        │
        ▼
Launch Streamlit Application
        │
        ▼
Upload Image
        │
        ▼
View Prediction
```

---

# Output

The deployed application will allow users to:

- Upload a skin lesion image.
- Enter clinical information.
- Receive disease prediction.
- View confidence score.
- Visualize Grad-CAM explanations.
- Receive intelligent decision support.

Future versions will also include SHAP explanations and multimodal predictions.

---

# Troubleshooting

Common issues and solutions:

### Virtual environment not activated

Ensure the virtual environment is activated before installing packages.

---

### Missing dependencies

Run:

```bash
pip install -r requirements.txt
```

---

### Model file not found

Verify that the trained model exists in the `models/` directory before running inference.

---

### Dataset not found

Ensure the HAM10000 dataset is downloaded and placed inside the `dataset/` directory.

---

### Streamlit application does not start

Verify that Streamlit is installed:

```bash
pip install streamlit
```

---

# Future Deployment

Future deployment options include:

- Streamlit Community Cloud
- Docker
- Microsoft Azure
- AWS
- Google Cloud Platform

These options will be explored after the local application is fully developed and tested.

---

# Deployment Checklist

Before deployment, verify that:

- All dependencies are installed.
- The dataset is available.
- The trained model is saved.
- The application runs without errors.
- Documentation is up to date.
- The latest code is pushed to GitHub.

---

# Summary

This deployment guide provides the steps required to set up, execute, and deploy the DermaAI project. Following this process ensures a consistent development environment and prepares the project for future deployment on cloud platforms while maintaining reliability and reproducibility.