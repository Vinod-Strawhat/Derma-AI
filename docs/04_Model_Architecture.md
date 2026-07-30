# Model Architecture

## Project Name

**DermaAI – Explainable Multimodal AI for Skin Disease Diagnosis and Intelligent Decision Support**

---

# Purpose

This document describes the Artificial Intelligence model used in DermaAI. It explains the architecture, model components, data flow, training process, and future multimodal integration.

---

# Overview

The DermaAI model is designed to diagnose skin diseases using deep learning. The system follows a modular architecture where different data types are processed independently and later combined for final prediction.

During the initial phase of development, the system focuses on image-based classification using EfficientNet-B0. In the second phase, additional patient information will be integrated to build a complete multimodal AI model.

---

# Model Architecture

```
                Input Skin Image
                       │
                       ▼
             Image Preprocessing
                       │
                       ▼
               EfficientNet-B0
                       │
                       ▼
             Image Feature Vector
                       │
                       ▼
              Classification Layer
                       │
                       ▼
          Predicted Skin Disease
                       │
                       ▼
              Confidence Score
                       │
                       ▼
             Grad-CAM Explanation
```

---

# Phase 1 Model

The first version of DermaAI focuses on image classification.

Components include:

- Image preprocessing
- EfficientNet-B0 backbone
- Fully connected classification layer
- Softmax output layer
- Grad-CAM visualization

---

# Phase 2 Multimodal Model

The second version extends the model by combining image features with clinical information.

```
                 Skin Image
                      │
                      ▼
              EfficientNet-B0
                      │
                      ▼
               Image Features
                      │
                      │
Symptoms ───► TF-IDF ─┤
                      │
Age ──────────────────┤
Gender ───────────────┤
Medical History ──────┤
                      ▼
             Feature Fusion Layer
                      │
                      ▼
            Classification Network
                      │
                      ▼
             Disease Prediction
                      │
                      ▼
           Grad-CAM + SHAP Output
```

---

# Input

## Image Input

- Skin lesion image
- RGB format
- Resized before inference

---

## Clinical Input (Future Phase)

- Symptoms
- Age
- Gender
- Medical history

---

# Feature Extraction

## Image Features

Model:

- EfficientNet-B0

Purpose:

- Extract high-level visual features from skin lesion images.

---

## Text Features

Method:

- TF-IDF Vectorization

Purpose:

- Convert symptom descriptions into numerical feature vectors.

---

## Structured Features

Patient information such as age, gender, and medical history will be converted into numerical representations before feature fusion.

---

# Feature Fusion

The extracted features from all modalities will be combined into a single feature vector.

This allows the model to make predictions using both image information and patient clinical data.

---

# Classification Layer

The fused features pass through fully connected neural network layers.

The final layer produces probabilities for each skin disease class using the Softmax activation function.

---

# Output

The model generates:

- Predicted disease
- Confidence score
- Probability distribution across all classes

---

# Explainable AI

DermaAI emphasizes model transparency.

## Grad-CAM

Provides visual heatmaps highlighting image regions that influenced the prediction.

---

## SHAP

Explains how symptoms and patient information contributed to the final prediction.

---

# Model Training

The training process includes:

- Dataset loading
- Image preprocessing
- Data augmentation
- Forward propagation
- Loss calculation
- Backpropagation
- Weight optimization
- Validation
- Model saving

---

# Evaluation Metrics

Model performance will be evaluated using:

- Accuracy
- Precision
- Recall
- F1-Score
- Confusion Matrix
- ROC-AUC (if applicable)

---

# Model Output Flow

```
Input Image
      │
      ▼
EfficientNet-B0
      │
      ▼
Classification
      │
      ▼
Prediction
      │
      ▼
Confidence Score
      │
      ▼
Grad-CAM
      │
      ▼
Result Display
```

---

# Future Enhancements

Future versions of the model may include:

- Attention mechanisms
- Transformer-based feature fusion
- Additional clinical datasets
- Continuous learning
- Model optimization for mobile deployment

---

# Summary

The DermaAI model follows a modular and scalable architecture that begins with image-based skin disease classification using EfficientNet-B0. It is designed to evolve into a multimodal AI system by integrating clinical information such as symptoms, age, gender, and medical history, while maintaining transparency through Explainable AI techniques like Grad-CAM and SHAP.