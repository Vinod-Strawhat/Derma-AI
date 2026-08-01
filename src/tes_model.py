from models.efficientnet import build_model
import torch


print("=" * 60)
print("DermaAI Model Test")
print("=" * 60)

# Build the model
model = build_model()

print("\nModel created successfully!\n")

# Print the final classifier
print("Final Classifier:")
print(model.classifier)

# Create one dummy image
dummy_input = torch.randn(1, 3, 224, 224)

# Forward pass
output = model(dummy_input)

print("\nForward Pass Successful!\n")

print(f"Input Shape  : {dummy_input.shape}")
print(f"Output Shape : {output.shape}")

print("\nPrediction Tensor:")
print(output)