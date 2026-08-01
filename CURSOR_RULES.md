# DermaAI - Cursor Project Instructions

## Project Name

DermaAI

## Project Goal

DermaAI is a professional Explainable Multimodal AI System for Skin Disease Diagnosis and Intelligent Decision Support.

The goal is to build an AI system that predicts skin diseases from dermatoscopic images and patient metadata while providing explainable predictions.

---

# Technology Stack

- Python
- PyTorch
- TorchVision
- OpenCV
- Pandas
- NumPy
- Matplotlib
- Streamlit
- SHAP
- Grad-CAM
- Scikit-learn

---

# Dataset

Primary Dataset:

HAM10000

Dataset Structure:

dataset/
    images/
    metadata/
        HAM10000_metadata.csv

Dataset images are NOT stored in GitHub.

---

# Current Progress

Completed:

- Git repository created
- Professional folder structure
- Documentation (13 documents)
- Virtual Environment
- requirements.txt
- Libraries installed
- Environment tested
- Dataset downloaded
- Dataset organized
- Git configured
- Dataset ignored using .gitignore

Current Stage:

Dataset Exploration (EDA)

---

# Folder Structure

src/
dataset/
docs/
models/

---

# Coding Standards

Always write:

- Clean code
- Modular code
- PEP8
- Type hints where appropriate
- Comments only when useful
- Reusable functions
- No duplicate code

Never hardcode unnecessary values.

---

# Git Rules

Never modify unrelated files.

Each module should be completed before moving to the next.

After completing a logical task:

git add
git commit
git push

---

# AI Responsibilities

Cursor Responsibilities

- Generate clean production-ready Python code.
- Follow project architecture.
- Never create unnecessary files.
- Keep code modular.
- Follow the existing folder structure.
- If unsure, ask instead of guessing.

ChatGPT Responsibilities

ChatGPT acts as the Senior AI Engineer.

ChatGPT designs:

- architecture
- ML pipeline
- preprocessing
- model selection
- debugging
- optimization
- explanations
- Git workflow

Cursor should follow ChatGPT's design.

---

# Developer

Developer:

Vinod

Vinod writes, runs, tests, commits and pushes code.

---

# Communication Rule

Whenever implementing a new module:

1. Understand the existing project.
2. Read related files.
3. Do not rewrite working code.
4. Modify only requested files.

---

# Current Task

Wait for ChatGPT's implementation prompt before generating code.