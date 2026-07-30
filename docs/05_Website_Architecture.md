# Website Architecture

## Project Name

**DermaAI – Explainable Multimodal AI for Skin Disease Diagnosis and Intelligent Decision Support**

---

# Purpose

This document describes the architecture of the DermaAI web application. The website serves as the interface between users and the AI model, allowing users to submit patient information, receive predictions, and visualize explainable AI outputs.

---

# Overview

The DermaAI website will be developed using **Streamlit**, providing a simple, interactive, and user-friendly interface. The application communicates with the trained AI model to perform real-time skin disease prediction and display explainable AI results.

---

# Website Architecture

```
                  User
                    │
                    ▼
          Streamlit Web Interface
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
 Upload Image   Enter Symptoms  Clinical Details
                                (Age, Gender,
                              Medical History)
        │           │           │
        └───────────┼───────────┘
                    ▼
          Input Validation Module
                    │
                    ▼
          Data Preprocessing Module
                    │
                    ▼
            AI Prediction Engine
                    │
                    ▼
         Explainable AI Module
       (Grad-CAM and SHAP)
                    │
                    ▼
          Decision Support Module
                    │
                    ▼
            Results Display Page
```

---

# Website Modules

## 1. Home Page

Purpose:

- Introduce the DermaAI project
- Display project objectives
- Guide users on how to use the application

Features:

- Project description
- Navigation menu
- Instructions

---

## 2. Prediction Page

Users can provide information required for prediction.

Inputs:

- Skin lesion image
- Symptoms
- Age
- Gender
- Medical history

Actions:

- Upload image
- Enter patient details
- Submit for prediction

---

## 3. AI Processing Module

This module sends the user inputs to the trained AI model.

Functions:

- Load trained model
- Perform preprocessing
- Generate prediction
- Calculate confidence score

---

## 4. Explainable AI Module

After prediction, the website displays model explanations.

Grad-CAM:

- Highlights important regions in the uploaded image.

SHAP:

- Displays how clinical information influenced the prediction.

---

## 5. Results Page

Displays the prediction results.

Information shown:

- Predicted disease
- Confidence score
- Grad-CAM visualization
- SHAP explanation
- Risk level
- Basic precautions
- Recommendation for medical consultation

---

# Website Navigation

```
Home
 │
 ▼
Prediction
 │
 ▼
Upload Image
 │
 ▼
Enter Clinical Information
 │
 ▼
Predict
 │
 ▼
Results
 │
 ▼
Explainable AI
```

---

# User Workflow

Step 1

Open the DermaAI website.

↓

Step 2

Upload a skin lesion image.

↓

Step 3

Enter symptoms.

↓

Step 4

Enter age, gender, and medical history.

↓

Step 5

Click the **Predict** button.

↓

Step 6

The AI model processes the inputs.

↓

Step 7

Prediction results are displayed.

↓

Step 8

Grad-CAM and SHAP explanations are shown.

↓

Step 9

The user reviews the recommendation.

---

# Technology Stack

Frontend:

- Streamlit

Backend:

- Python

Deep Learning:

- PyTorch

Image Processing:

- OpenCV

Machine Learning:

- Scikit-learn

Explainable AI:

- Grad-CAM
- SHAP

---

# Security Considerations

The website will:

- Validate all user inputs.
- Process uploaded images safely.
- Prevent invalid file uploads.
- Handle prediction errors gracefully.

Future versions may include user authentication and secure cloud deployment.

---

# Future Enhancements

Future versions of the website may include:

- User login and registration
- Patient history management
- PDF report generation
- Doctor recommendation system
- Multilingual interface
- Cloud deployment
- Mobile-friendly interface

---

# Summary

The DermaAI website provides an intuitive interface for interacting with the AI model. It enables users to submit patient information, receive skin disease predictions, visualize explainable AI outputs, and access intelligent decision support through a simple and scalable Streamlit application.