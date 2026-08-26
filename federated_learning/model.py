import torch
import torch.nn as nn

class RareDiseaseModel(nn.Module):
    def __init__(self, input_features):
        super(RareDiseaseModel, self).__init__()
        # A simple Feed-Forward Neural Network for tabular classification
        self.network = nn.Sequential(
            nn.Linear(input_features, 64),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 1),
            nn.Sigmoid() # Assuming binary classification (e.g., 30-day hospitalization risk)
        )

    def forward(self, x):
        return self.network(x)