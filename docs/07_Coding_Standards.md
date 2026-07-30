# Coding Standards

## Project Name

**DermaAI – Explainable Multimodal AI for Skin Disease Diagnosis and Intelligent Decision Support**

---

# Purpose

This document defines the coding standards and best practices for the DermaAI project. Following consistent coding conventions improves readability, maintainability, collaboration, debugging, and future scalability.

---

# Programming Language

Primary Language:

- Python 3.11+

---

# Development Environment

Recommended Tools:

- Visual Studio Code
- Git
- GitHub
- Python Virtual Environment (venv)

---

# Coding Principles

The DermaAI project follows these principles:

- Write clean and readable code.
- Keep functions small and focused.
- Avoid duplicate code.
- Use meaningful names for variables and functions.
- Write reusable modules.
- Handle exceptions properly.
- Add comments only when necessary.

---

# File Naming Convention

Use lowercase letters with underscores.

Examples:

```
train_model.py
preprocess_images.py
predict.py
gradcam.py
utils.py
```

Avoid:

```
TrainModel.py
MyCode.py
FinalCode.py
```

---

# Variable Naming

Use descriptive variable names.

Good Examples:

```python
image_path
patient_age
model_output
prediction_score
```

Avoid:

```python
a
temp
x
data1
```

---

# Function Naming

Function names should describe the action being performed.

Examples:

```python
load_dataset()
preprocess_image()
train_model()
predict_disease()
generate_gradcam()
```

---

# Class Naming

Use PascalCase for class names.

Examples:

```python
DatasetLoader
ImageClassifier
PredictionEngine
GradCAMGenerator
```

---

# Code Formatting

- Indent using 4 spaces.
- Keep line length reasonable (preferably under 100 characters).
- Leave a blank line between functions and classes.
- Group related code together.

---

# Project Structure

Each module should have a single responsibility.

Examples:

```
preprocessing/
    image_processing.py

training/
    trainer.py

inference/
    predictor.py

explainability/
    gradcam.py
    shap_explainer.py
```

---

# Error Handling

Handle expected errors gracefully.

Example:

```python
try:
    image = load_image(image_path)
except FileNotFoundError:
    print("Image not found.")
```

Avoid silent failures.

---

# Documentation

Every Python file should begin with a short description.

Example:

```python
"""
Image preprocessing functions for DermaAI.
"""
```

Each function should include a docstring.

Example:

```python
def preprocess_image(image):
    """
    Resize and normalize the input image.

    Args:
        image: Input image.

    Returns:
        Preprocessed image.
    """
```

---

# Comments

Write comments only when they add useful context.

Good:

```python
# Resize image to EfficientNet input size.
```

Avoid:

```python
# Increment i.
i += 1
```

---

# Version Control

Use Git throughout development.

Commit only after completing a meaningful feature or document.

Example commit messages:

```
docs: add dataset documentation
feat: implement image preprocessing
feat: add EfficientNet-B0 training
feat: integrate Grad-CAM
fix: resolve preprocessing bug
refactor: improve model organization
```

---

# Dependency Management

All project dependencies must be listed in:

```
requirements.txt
```

Avoid installing unnecessary packages.

---

# Testing

Before committing code:

- Ensure the code runs without errors.
- Test new functionality.
- Verify outputs.
- Remove unused code.

---

# Security

- Never hardcode passwords or API keys.
- Ignore virtual environments and temporary files using `.gitignore`.
- Validate user inputs in the web application.

---

# AI Development Guidelines

When using AI coding assistants:

- Generate one module at a time.
- Review AI-generated code before committing.
- Test the code locally.
- Refactor if necessary.
- Keep documentation synchronized with implementation.

---

# Summary

Following these coding standards ensures that the DermaAI project remains clean, consistent, maintainable, and scalable. These guidelines support professional software development practices and make collaboration easier throughout the project lifecycle.