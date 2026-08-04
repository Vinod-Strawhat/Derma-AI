import torch
import torch.nn as nn
from torchvision import models


class MultimodalEfficientNet(nn.Module):

    def __init__(self, num_classes=8):
        super().__init__()

        # EfficientNet-B0 Backbone
        self.backbone = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.DEFAULT)

        image_features = self.backbone.classifier[1].in_features

        self.backbone.classifier = nn.Identity()

        # Metadata Branch
        self.metadata_network = nn.Sequential(
            nn.Linear(3, 32),
            nn.ReLU(),
            nn.Linear(32, 64),
            nn.ReLU(),
        )

        # Fusion Layer
        self.classifier = nn.Sequential(
            nn.Linear(image_features + 64, 512),
            nn.ReLU(),
            nn.Dropout(0.3),

            nn.Linear(512, 256),
            nn.ReLU(),
            nn.Dropout(0.3),

            nn.Linear(256, num_classes)
        )

    def forward(self, image, age, gender, region):

        image_features = self.backbone(image)

        metadata = torch.stack(
            [
                age.float(),
                gender.float(),
                region.float(),
            ],
            dim=1,
        )

        metadata_features = self.metadata_network(metadata)

        fused = torch.cat(
            [image_features, metadata_features],
            dim=1,
        )

        output = self.classifier(fused)

        return output