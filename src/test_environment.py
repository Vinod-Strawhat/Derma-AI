import numpy as np
import pandas as pd
import cv2
import matplotlib
import sklearn
import torch
import torchvision
import streamlit
import shap

print("=== DermaAI Environment Check ===")
print("NumPy:", np.__version__)
print("Pandas:", pd.__version__)
print("OpenCV:", cv2.__version__)
print("Matplotlib:", matplotlib.__version__)
print("Scikit-learn:", sklearn.__version__)
print("Torch:", torch.__version__)
print("TorchVision:", torchvision.__version__)
print("Streamlit:", streamlit.__version__)
print("SHAP:", shap.__version__)

print("\n✅ All libraries imported successfully!")