# System Architecture

## Project Name

**DermaAI – Explainable Multimodal AI for Skin Disease Diagnosis and Intelligent Decision Support**

---

# Introduction

The DermaAI system is designed as a modular Artificial Intelligence platform that assists in skin disease diagnosis by combining multiple sources of patient information. The system integrates computer vision, clinical information, explainable artificial intelligence, and an interactive web application to provide accurate and transparent diagnostic support.

The architecture is divided into independent modules, making the project scalable, maintainable, and easy to extend with future features.

---

# Overall System Architecture

The complete workflow of DermaAI consists of the following modules:

1. Data Collection
2. Data Preprocessing
3. Feature Extraction
4. Multimodal Feature Fusion
5. Disease Classification
6. Explainable AI
7. Decision Support
8. Streamlit Web Application

---

# High-Level Architecture

```
                        User
                          │
                          ▼
        ┌────────────────────────────────┐
        │      Streamlit Web Interface    │
        └────────────────────────────────┘
                          │
      ┌───────────────────┼───────────────────┐
      │                   │                   │
      ▼                   ▼                   ▼
 Skin Image          Symptoms          Clinical Details
                                         (Age, Gender,
                                       Medical History)
      │                   │                   │
      ▼                   ▼                   ▼
 Image Preprocessing   Text Processing   Structured Data Processing
      │                   │                   │
      ▼                   ▼                   ▼
 EfficientNet-B0        TF-IDF           Dense Neural Network
      └───────────────┬────────────────────────┘
                      ▼
             Feature Fusion Layer
                      │
                      ▼
          Skin Disease Classification
                      │
                      ▼
        Explainable AI (Grad-CAM + SHAP)
                      │
                      ▼
            Intelligent Decision Support
                      │
                      ▼
               Display Results to User
```

---

# Module Description

## Module 1 – Data Collection

This module collects all patient inputs required for diagnosis.

Inputs include:

- Skin lesion image
- Patient symptoms
- Age
- Gender
- Medical history

Dataset:

- HAM10000

---

## Module 2 – Data Preprocessing

The preprocessing module prepares the data before training and prediction.

Image preprocessing includes:

- Image resizing
- Normalization
- RGB conversion
- Data augmentation
- Dataset splitting

Clinical data preprocessing includes:

- Missing value handling
- Text cleaning
- Data encoding

---

## Module 3 – Feature Extraction

Different AI models are used for different data types.

Image Features

- EfficientNet-B0

Symptom Features

- TF-IDF Vectorization

Structured Clinical Features

- Dense Neural Network

---

## Module 4 – Multimodal Feature Fusion

The extracted features from all modalities are combined into a unified feature representation.

The fusion layer enables the AI model to consider both visual and clinical information simultaneously before making predictions.

---

## Module 5 – Disease Classification

The fused features are passed to the final classification layer.

Output:

- Predicted skin disease
- Confidence score

---

## Module 6 – Explainable Artificial Intelligence

The prediction is explained using Explainable AI techniques.

Grad-CAM

- Highlights infected regions in the uploaded image.

SHAP

- Explains the contribution of symptoms and clinical information towards the prediction.

---

## Module 7 – Intelligent Decision Support

The system provides meaningful clinical assistance after prediction.

The output includes:

- Disease name
- Confidence score
- Risk level
- Basic precautions
- Recommendation for further medical consultation

---

## Module 8 – Streamlit Web Application

The web application acts as the user interface.

Functions include:

- Upload image
- Enter symptoms
- Enter patient information
- View prediction
- View Grad-CAM visualization
- View SHAP explanation
- Download prediction report (Future Enhancement)

---

# Phase-wise Architecture

## Phase 1

Image-based AI Model

Modules included:

- Dataset Preparation
- Image Preprocessing
- EfficientNet-B0 Training
- Model Evaluation
- Grad-CAM
- Image Prediction

---

## Phase 2

Complete Multimodal AI System

Additional modules:

- Symptom Processing
- Medical History Processing
- Feature Fusion
- SHAP
- Decision Support
- Streamlit Website
- Final Deployment

---

# Design Principles

The architecture follows the following software engineering principles:

- Modular Design
- Scalability
- Maintainability
- Explainability
- Reusability
- Easy Integration

Each module can be independently developed, tested, and upgraded without affecting other components.

---

# Future Enhancements

Future versions of DermaAI may include:

- Doctor recommendation system
- Multilingual support
- Cloud deployment
- Mobile application
- Electronic Health Record (EHR) integration
- Continuous model learning using new clinical data

---

# Summary

The proposed architecture provides a scalable and modular framework for building an Explainable Multimodal AI system for skin disease diagnosis. The modular design ensures easy development, testing, deployment, and future expansion while maintaining transparency and high diagnostic performance.