# DermaAI 🩺

An AI-assisted dermatology platform for preliminary skin health assessment using a multimodal deep learning model.

DermaAI combines skin lesion images with patient metadata such as age, gender, and body region to provide a preliminary prediction, confidence information, risk indication, and visual explanation using Grad-CAM.

> Disclaimer: DermaAI is a research/educational project for preliminary skin health guidance. It is not a medical diagnostic system and does not replace a qualified dermatologist or other healthcare professional.


## ✨ Features

### 🧠 AI-Powered Skin Analysis

- Multimodal deep learning model
- Skin image + age + gender + body region
- Prediction across 8 skin-condition classes
- Top-3 predictions when the model is uncertain
- Confidence score
- User-facing risk indication
- Grad-CAM visual explanation

### 👤 User Features

- Sign up and sign in
- Personal profile
- Individual scan history
- Skin concern tracking
- Compare previous scans
- Recent scan dashboard
- Responsive design for laptop and mobile

### 🩺 Health Guidance

- Condition-specific preliminary Do's & Don'ts
- Uncertainty-aware guidance
- Recommendation to consult a dermatologist when appropriate
- Nearby dermatologist assistance for higher-risk situations

### 🌐 Languages

The website currently supports:

- English
- Kannada
- Telugu
- Tamil
- Hindi


## 🧠 Multimodal AI Model

DermaAI uses a multimodal deep learning architecture that combines:

    Skin Image
         +
    Patient Metadata
    (Age, Gender, Body Region)
         ↓
    Multimodal Neural Network
         ↓
    Disease Prediction
         ↓
    Confidence + Explanation

The image component extracts visual features from the skin image while the metadata provides additional contextual information to the model.


## 🔬 Disease Classes

The current model predicts 8 classes:

1. Actinic Keratosis
2. Basal Cell Carcinoma
3. Benign Keratosis
4. Dermatofibroma
5. Melanoma
6. Melanocytic Nevus
7. Squamous Cell Carcinoma
8. Vascular Lesion


## 📊 Model Performance

Current validation results:

| Metric | Score |
| --- | ---: |
| Validation Accuracy | 88.85% |
| Precision | 89.52% |
| Recall | 88.85% |
| Weighted F1-Score | 89.04% |
| Best Epoch | 18 |

These results represent the current model evaluation and should not be interpreted as clinical diagnostic accuracy.


## 🔍 Explainable AI

DermaAI uses Grad-CAM (Gradient-weighted Class Activation Mapping) to provide a visual explanation of the model's prediction.

    Original Skin Image
            ↓
       Model Analysis
            ↓
       Grad-CAM Heatmap
            ↓
      Visual Explanation

The heatmap indicates image regions that influenced the model's prediction.

Grad-CAM does not measure disease spread, lesion size, disease stage, or medical severity.


## 📚 Datasets

The project uses data derived from the following datasets:

- HAM10000
- ISIC 2019
- PAD-UFES-20
- Derm7pt

The original dataset files are not included in this repository. Merged metadata required by the project is included where applicable.


## 🏗️ Project Structure

    Derma-AI/
    │
    ├── backend/
    │   └── app/
    │       ├── api/
    │       ├── core/
    │       ├── models/
    │       ├── schemas/
    │       ├── services/
    │       └── main.py
    │
    ├── checkpoints/
    │   └── best_multimodal_model.pth
    │
    ├── datasets/
    │   └── merged/
    │
    ├── frontend/
    │   ├── public/
    │   └── src/
    │       ├── components/
    │       ├── context/
    │       ├── data/
    │       └── pages/
    │
    ├── results/
    │
    ├── scripts/
    │
    ├── src/
    │   ├── data/
    │   ├── evaluation/
    │   ├── explainability/
    │   ├── inference/
    │   ├── models/
    │   ├── utils/
    │   └── train.py
    │
    ├── requirements.txt
    └── README.md


## ⚙️ Installation

### 1. Clone the Repository

    git clone -b version2-multimodal https://github.com/Vinod-Strawhat/Derma-AI.git
    cd Derma-AI


## 🐍 Backend Setup

Create a Python virtual environment.

### Windows

    python -m venv .venv

Activate it:

    .venv\Scripts\Activate.ps1

Install the backend dependencies:

    pip install -r backend/requirements.txt


## 🔐 Environment Configuration

Do not commit real secrets to GitHub.

Use the provided environment example:

    backend/.env.example

Create:

    backend/.env

and configure the required environment variables for your local environment.


## 🌐 Frontend Setup

Open another terminal and navigate to the frontend:

    cd frontend

Install dependencies:

    npm install

Run the frontend development server:

    npm run dev


## 🚀 Running the Backend

From the project root, start the FastAPI backend:

    uvicorn backend.app.main:app --reload

If your local Python module configuration requires a different command, use the corresponding project entry point.


## 🔗 Application Architecture

DermaAI follows this architecture:

                         User
                          │
                          ▼
                  React Frontend
                          │
                       HTTP/API
                          │
                          ▼
                   FastAPI Backend
                          │
               ┌──────────┼──────────┐
               ▼          ▼          ▼
            PyTorch    Database    Grad-CAM
             Model
               │
               ▼
          Prediction
               │
               ▼
          Risk + Guidance
               │
               ▼
            Frontend

The frontend communicates with the backend API, while the backend handles model inference, scan-related operations, and supporting services.


## 🧠 Pretrained Model

The trained multimodal checkpoint is included in this repository:

    checkpoints/best_multimodal_model.pth

You do not need to retrain the model to run inference.

The checkpoint contains the trained weights for the current multimodal model.


## 📷 Using Skin Analysis

The general workflow is:

    1. Sign in / Sign up
            ↓
    2. Start Skin Check
            ↓
    3. Upload or capture a skin image
            ↓
    4. Enter age, gender and body region
            ↓
    5. Run analysis
            ↓
    6. View prediction and confidence
            ↓
    7. Review Top-3 predictions when applicable
            ↓
    8. View Grad-CAM explanation
            ↓
    9. Review preliminary guidance
            ↓
    10. Save and review the scan history


## 📈 Scan History & Comparison

Signed-in users can view their previous scans.

Scans can be organized around individual skin concerns, allowing users to compare their own previous and recent scans.

    User
     ↓
    Skin Concern
     ↓
    Multiple Scans
     ↓
    History
     ↓
    Compare

Comparison is intended to help users review their previous AI-assisted assessments.

It does not medically establish disease progression.


## ⚠️ Risk & Uncertainty

The system distinguishes between model confidence and medical severity.

For example:

    Condition A   40%
    Condition B   40%
    Condition C   20%

When the model is uncertain, DermaAI should not present one condition as a confirmed diagnosis.

Instead, the application can provide preliminary precautions and recommend professional medical evaluation when appropriate.

> AI confidence is not the same as disease severity.


## 🩺 Medical Guidance

DermaAI provides preliminary guidance associated with the model's prediction.

When the prediction is uncertain, the system can provide general preliminary precautions based on the possible conditions rather than presenting one condition as certain.

Users should seek professional medical evaluation when appropriate.


## 🌐 Multilingual Support

DermaAI currently supports five languages:

- English
- Kannada
- Telugu
- Tamil
- Hindi

The language selector allows users to switch the website language.


## 👨‍⚕️ Dermatologist Assistance

For situations where professional evaluation is recommended, DermaAI provides a dermatologist assistance feature.

The application can use the user's location to help identify nearby dermatologist options where the feature is available.

This feature is intended to help users seek professional care and does not replace medical consultation.


## 🔮 Future Improvements

Potential future improvements include:

- Further model accuracy improvements
- More robust validation
- Improved lesion segmentation
- Improved image-change analysis
- Additional language support
- More extensive clinical validation
- Improved deployment infrastructure


## 🧪 Model Development

The repository contains the code used for:

- Dataset preparation
- Metadata processing
- Multimodal dataset loading
- Model training
- Model evaluation
- Inference
- Explainability using Grad-CAM

The current trained checkpoint is provided so that users can perform inference without retraining the model.


## 📁 Dataset Information

The original image datasets are not included in this repository because of their size and dataset distribution considerations.

The repository contains the required merged metadata files used by the project.

If you intend to retrain the model, the required source datasets must be obtained separately and placed according to the project's dataset structure.


## 🛡️ Privacy & Security

Do not commit:

- API keys
- Passwords
- JWT secrets
- Database credentials
- Private environment variables

Use the provided .env.example files as templates for local configuration.


## 👥 Project Purpose

DermaAI was developed as an AI-assisted dermatology research and educational project focused on making preliminary skin health assessment more accessible and user-friendly.

The project combines:

    Multimodal AI
           +
    Explainable AI
           +
    User-Friendly Web Interface
           +
    Scan History
           +
    Scan Comparison
           +
    Preliminary Health Guidance


## ⚠️ Medical Disclaimer

DermaAI is an AI-assisted research and educational project.

Its predictions and guidance are intended for preliminary information only and should not be used as a substitute for professional medical diagnosis or treatment.

A model prediction or confidence score does not constitute a medical diagnosis.

Users should consult a qualified dermatologist or healthcare professional for medical concerns, especially when symptoms persist, change, worsen, or appear concerning.


## 🛠️ Technology Stack

### Machine Learning

- Python
- PyTorch
- Torchvision
- Multimodal Deep Learning
- Grad-CAM

### Backend

- FastAPI
- Uvicorn
- SQLAlchemy
- JWT Authentication

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Lucide React

### Development

- Git
- GitHub
- Python Virtual Environment
- npm


## 📌 Important Notes

- The current model accuracy is 88.85% validation accuracy.
- Model accuracy may be improved in future versions.
- The trained multimodal checkpoint is already included in the repository.
- Retraining is not required for normal inference.
- Original training datasets are not included.
- Real production deployment requires appropriate environment configuration.
- DermaAI is not a replacement for professional medical care.


## 📄 License

This project is developed for academic, research, and educational purposes.

Please review the licenses and usage requirements of the individual datasets and third-party libraries before redistribution or commercial use.
