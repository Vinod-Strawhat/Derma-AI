# API Design

## Project Name

**DermaAI – Explainable Multimodal AI for Skin Disease Diagnosis and Intelligent Decision Support**

---

# Purpose

This document defines the internal APIs (interfaces) used throughout the DermaAI project. It specifies how different modules communicate, what inputs they accept, what outputs they return, and their responsibilities.

The purpose is to ensure consistency, modularity, and maintainability while enabling independent development of each component.

---

# Design Principles

The API design follows these principles:

- Single Responsibility Principle
- Loose Coupling
- High Cohesion
- Reusability
- Scalability
- Readability

Each module should expose only the functions required by other modules.

---

# System Modules

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
Inference
    │
    ▼
Explainability
    │
    ▼
Decision Support
    │
    ▼
Streamlit Application
```

---

# Module APIs

## Dataset Module

Location

```
src/data/
```

Responsibilities

- Load dataset
- Read metadata
- Split dataset
- Create DataLoader objects

Expected Functions

```python
load_dataset()

load_metadata()

create_dataloaders()

split_dataset()
```

---

## Preprocessing Module

Location

```
src/preprocessing/
```

Responsibilities

- Resize images
- Normalize images
- Apply augmentations
- Prepare tensors

Expected Functions

```python
preprocess_image()

train_transforms()

validation_transforms()

predict_transforms()
```

---

## Training Module

Location

```
src/training/
```

Responsibilities

- Initialize model
- Train model
- Validate model
- Save checkpoints

Expected Functions

```python
train_model()

validate_model()

save_checkpoint()

load_checkpoint()
```

---

## Inference Module

Location

```
src/inference/
```

Responsibilities

- Load trained model
- Predict disease
- Calculate confidence score

Expected Functions

```python
load_model()

predict()

predict_batch()
```

---

## Explainability Module

Location

```
src/explainability/
```

Responsibilities

- Generate Grad-CAM
- Generate SHAP explanations

Expected Functions

```python
generate_gradcam()

generate_shap()
```

---

## Decision Support Module

Location

```
src/decision_support/
```

Responsibilities

- Interpret predictions
- Generate recommendations
- Assign risk levels

Expected Functions

```python
generate_recommendation()

calculate_risk()

prepare_result()
```

---

# Streamlit Application

Location

```
app/
```

Responsibilities

- Collect user input
- Call inference module
- Display prediction
- Display Grad-CAM
- Display SHAP
- Display recommendations

Main Entry

```
app.py
```

---

# Data Flow

```
User
 │
 ▼
Upload Image
 │
 ▼
Preprocessing
 │
 ▼
Inference
 │
 ▼
Disease Prediction
 │
 ▼
Grad-CAM
 │
 ▼
Decision Support
 │
 ▼
Streamlit Output
```

---

# Function Design Guidelines

Every public function should:

- Have a clear purpose
- Accept only required parameters
- Return predictable outputs
- Handle exceptions
- Include type hints
- Include docstrings

Example

```python
def predict(image_path: str) -> dict:
    """
    Predict the skin disease from an input image.

    Args:
        image_path (str): Path to the input image.

    Returns:
        dict: Prediction results including disease name and confidence score.
    """
```

---

# Error Handling

Each module should handle expected errors gracefully.

Examples:

- Missing image
- Invalid file format
- Missing model weights
- Corrupted dataset
- Invalid user input

Errors should provide meaningful messages without crashing the application.

---

# Future APIs

Future versions may introduce APIs for:

- Symptom Processing
- Feature Fusion
- User Authentication
- Doctor Recommendation
- PDF Report Generation
- Cloud Deployment
- Electronic Health Record (EHR) Integration

These APIs will follow the same design principles.

---

# Summary

This document defines the communication contract between all modules of the DermaAI project. By following these interfaces, developers and AI coding assistants can implement individual components independently while ensuring seamless integration across the entire application.