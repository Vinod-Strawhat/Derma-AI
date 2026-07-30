# AI Master Prompt

## Project Name

**DermaAI – Explainable Multimodal AI for Skin Disease Diagnosis and Intelligent Decision Support**

---

# Purpose

This document provides a master instruction set for AI coding assistants (such as ChatGPT, Claude, Codex, Gemini, or similar tools) working on the DermaAI project. It ensures that all generated code follows the project's architecture, coding standards, and development goals.

---

# Project Overview

DermaAI is an Explainable Multimodal Artificial Intelligence system designed to assist in the diagnosis of skin diseases.

The project combines:

- Skin lesion image analysis
- Patient symptoms
- Age
- Gender
- Medical history

The system provides:

- Disease prediction
- Confidence score
- Explainable AI using Grad-CAM and SHAP
- Intelligent decision support
- Streamlit web interface

---

# Primary Objective

Develop a modular, maintainable, production-quality AI application while keeping the code clean, readable, and well-documented.

---

# Technology Stack

Programming Language

- Python 3.11+

Deep Learning

- PyTorch

Computer Vision

- OpenCV

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

---

# Development Principles

AI-generated code must follow these principles:

- Modular architecture
- Single responsibility per module
- Readable code
- Reusable functions
- Proper error handling
- Clear documentation
- Meaningful variable names
- No unnecessary complexity

---

# Coding Guidelines

AI assistants should:

- Generate one module at a time.
- Avoid generating the entire project in one response.
- Keep files focused on a single responsibility.
- Follow Python best practices.
- Include function docstrings.
- Add comments only where they improve understanding.
- Avoid duplicated code.
- Suggest improvements when appropriate without changing the project scope.

---

# Project Structure

AI assistants should follow this directory structure:

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

Do not reorganize the project unless explicitly requested.

---

# Current Development Status

Completed:

- Project documentation
- System architecture
- Dataset documentation
- Model architecture
- Website architecture
- Folder structure
- Coding standards
- Development roadmap

Upcoming implementation tasks:

- Dataset preparation
- Image preprocessing
- EfficientNet-B0 implementation
- Model training
- Model evaluation
- Grad-CAM integration
- Streamlit application
- Multimodal feature fusion
- SHAP integration
- Final deployment

---

# Implementation Rules

When generating code:

- Explain the purpose of the module.
- List required dependencies.
- Generate complete, runnable code.
- Keep functions small and reusable.
- Handle exceptions where appropriate.
- Follow the documented architecture.

Do not:

- Skip preprocessing.
- Hardcode dataset paths.
- Mix unrelated functionality in the same file.
- Introduce libraries without explaining why they are needed.

---

# Documentation Rules

Whenever a new feature is added:

- Update relevant documentation if needed.
- Keep code and documentation consistent.
- Use meaningful Git commit messages.

Example commit messages:

```
feat: implement image preprocessing
feat: add EfficientNet-B0 training
feat: integrate Grad-CAM
fix: resolve preprocessing issue
docs: update model architecture
```

---

# Code Quality Checklist

Before considering a module complete, verify that:

- The code runs successfully.
- Imports are organized.
- Functions have docstrings.
- Variable names are descriptive.
- Errors are handled.
- The module follows the planned architecture.

---

# Future Scope

Future versions of DermaAI may include:

- Transformer-based multimodal learning
- Doctor recommendation system
- Electronic Health Record (EHR) integration
- Cloud deployment
- Mobile application
- User authentication
- PDF report generation

These features should not be implemented unless explicitly requested.

---

# Final Instruction

Always treat DermaAI as a professional software engineering project.

Maintain consistency with the documented architecture, coding standards, folder structure, and roadmap.

If there is any uncertainty, prefer asking for clarification rather than making assumptions that could change the project's intended design.