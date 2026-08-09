"""
Multimodal EfficientNet model for DermaAI Version 2.

Inputs:
    - Skin lesion image
    - Patient age
    - Patient gender
    - Lesion/body region

Outputs:
    - 8 disease-class logits
"""

import torch
import torch.nn as nn
from torchvision import models


class MultimodalEfficientNet(nn.Module):

    def __init__(
        self,
        num_classes=8,
        num_regions=50,
        num_genders=3,
    ):
        super().__init__()

        # ==================================================
        # IMAGE BRANCH
        # ==================================================

        self.backbone = models.efficientnet_b0(
            weights=models.EfficientNet_B0_Weights.DEFAULT
        )

        image_features = (
            self.backbone.classifier[1].in_features
        )

        # Remove original ImageNet classifier
        self.backbone.classifier = nn.Identity()

        # ==================================================
        # METADATA BRANCH
        # ==================================================

        # Age is a continuous feature.
        # Gender and region are categorical features.

        self.gender_embedding = nn.Embedding(
            num_embeddings=num_genders,
            embedding_dim=8,
        )

        self.region_embedding = nn.Embedding(
            num_embeddings=num_regions,
            embedding_dim=16,
        )

        # Age (1) + gender embedding (8)
        # + region embedding (16)
        metadata_input_size = 1 + 8 + 16

        self.metadata_network = nn.Sequential(
            nn.Linear(metadata_input_size, 64),
            nn.ReLU(),

            nn.BatchNorm1d(64),

            nn.Linear(64, 128),
            nn.ReLU(),

            nn.Dropout(0.2),
        )

        metadata_features = 128

        # ==================================================
        # FUSION
        # ==================================================

        self.classifier = nn.Sequential(

            nn.Linear(
                image_features + metadata_features,
                512,
            ),

            nn.ReLU(),

            nn.Dropout(0.3),

            nn.Linear(
                512,
                256,
            ),

            nn.ReLU(),

            nn.Dropout(0.3),

            nn.Linear(
                256,
                num_classes,
            ),
        )

    # ======================================================
    # FORWARD
    # ======================================================

    def forward(
        self,
        image,
        age,
        gender,
        region,
    ):

        # --------------------------------------------------
        # Image Features
        # --------------------------------------------------

        image_features = self.backbone(image)

        # --------------------------------------------------
        # Age
        # --------------------------------------------------

        age = age.float()

        # Normalize age approximately to 0-1 range.
        # Ages outside this range are safely clipped.

        age = age / 100.0

        age = age.unsqueeze(1)

        # --------------------------------------------------
        # Gender Embedding
        # --------------------------------------------------

        gender = gender.long()

        gender_features = self.gender_embedding(
            gender
        )

        # --------------------------------------------------
        # Region Embedding
        # --------------------------------------------------

        region = region.long()

        region_features = self.region_embedding(
            region
        )

        # --------------------------------------------------
        # Combine Metadata
        # --------------------------------------------------

        metadata = torch.cat(
            [
                age,
                gender_features,
                region_features,
            ],
            dim=1,
        )

        metadata_features = self.metadata_network(
            metadata
        )

        # --------------------------------------------------
        # Feature Fusion
        # --------------------------------------------------

        fused_features = torch.cat(
            [
                image_features,
                metadata_features,
            ],
            dim=1,
        )

        # --------------------------------------------------
        # Classification
        # --------------------------------------------------

        output = self.classifier(
            fused_features
        )

        return output