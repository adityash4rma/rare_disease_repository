import argparse
import os
import pandas as pd
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset
from collections import OrderedDict
import flwr as fl
from backend.model_def import RareDiseaseNet

# 1. Parse CLI Arguments
parser = argparse.ArgumentParser(description="Hospital Node Client for Federated Learning")
parser.add_argument("--node-id", type=str, required=True, help="Hospital Node ID (e.g., A, B, or C)")
parser.add_argument("--server-address", type=str, default=os.getenv("SERVER_ADDRESS", "127.0.0.1:8090"), help="FL Server Address (host:port)")
args = parser.parse_args()

FEATURE_COLUMNS = [
    "Systolic_BP_mmHg",
    "Diastolic_BP_mmHg",
    "Heart_Rate_bpm",
    "Body_Temp_Celsius",
    "BMI",
    "Hemoglobin_g_dL",
    "WBC_Count_cells_mcL",
    "Platelet_Count_cells_mcL",
    "Serum_Creatinine_mg_dL",
    "ALT_U_L"
]

# 2. Robust Local CSV Data Loader
def load_local_data(node_id):
    file_path = f"hospitals/hospital_{node_id.lower()}/hospital_{node_id.lower()}.csv"
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Hospital data partition not found: {file_path}")
    
    try:
        df = pd.read_csv(file_path, sep=None, engine='python', encoding='utf-8', on_bad_lines='skip')
    except Exception:
        df = pd.read_csv(file_path, sep=None, engine='python', encoding='latin1', on_bad_lines='skip')

    # If dataset has the standard 10 feature columns, use them; otherwise use first 10 numerical columns
    available_cols = [c for c in FEATURE_COLUMNS if c in df.columns]
    if len(available_cols) == 10:
        X_df = df[FEATURE_COLUMNS].copy()
    else:
        # Fallback to first 10 columns
        X_df = df.iloc[:, :10].copy()
        for col in X_df.columns:
            if X_df[col].dtype == 'object':
                X_df[col] = pd.factorize(X_df[col])[0]

    X_df = X_df.fillna(0)
    X_raw = X_df.values.astype(np.float32)

    # Standardize numerical features for stable PyTorch training
    mean = np.mean(X_raw, axis=0, keepdims=True)
    std = np.std(X_raw, axis=0, keepdims=True) + 1e-7
    X_normalized = (X_raw - mean) / std

    # Target: High Risk (Progressive) -> 1.0, Stable -> 0.0
    if "Clinical_Outcome_Target" in df.columns:
        y_raw = (df["Clinical_Outcome_Target"].astype(str).str.contains("High Risk", case=False)).astype(np.float32).values
    elif "Clinical_Severity_Score_1_10" in df.columns:
        y_raw = (df["Clinical_Severity_Score_1_10"] >= 6).astype(np.float32).values
    else:
        y_raw = np.where(df.iloc[:, -1].values > 0, 1.0, 0.0).astype(np.float32)

    X = torch.tensor(X_normalized, dtype=torch.float32)
    y = torch.tensor(y_raw, dtype=torch.float32).unsqueeze(1)
    return X, y

# 3. Flower NumPy Client
class HospitalNodeClient(fl.client.NumPyClient):
    def __init__(self, node_id):
        self.node_id = node_id
        self.model = RareDiseaseNet(input_dim=10)
        self.criterion = nn.BCELoss()
        self.optimizer = torch.optim.Adam(self.model.parameters(), lr=0.001)
        
        X, y = load_local_data(node_id)
        dataset = TensorDataset(X, y)
        self.train_loader = DataLoader(dataset, batch_size=32, shuffle=True)
        self.num_samples = len(X)
        print(f"Hospital {self.node_id} loaded {self.num_samples} local clinical records.")

    def get_parameters(self, config):
        return [val.cpu().numpy() for _, val in self.model.state_dict().items()]

    def set_parameters(self, parameters):
        params_dict = zip(self.model.state_dict().keys(), parameters)
        state_dict = OrderedDict({k: torch.tensor(v) for k, v in params_dict})
        self.model.load_state_dict(state_dict, strict=True)

    def fit(self, parameters, config):
        self.set_parameters(parameters)
        self.model.train()
        
        epochs = 3
        for epoch in range(epochs):
            for x_batch, y_batch in self.train_loader:
                self.optimizer.zero_grad()
                outputs = self.model(x_batch)
                loss = self.criterion(outputs, y_batch)
                loss.backward()
                self.optimizer.step()

        return self.get_parameters(config={}), self.num_samples, {}

    def evaluate(self, parameters, config):
        self.set_parameters(parameters)
        self.model.eval()
        
        total_loss = 0.0
        correct = 0
        total_samples = 0

        with torch.no_grad():
            for x_batch, y_batch in self.train_loader:
                outputs = self.model(x_batch)
                loss = self.criterion(outputs, y_batch)
                total_loss += loss.item() * len(y_batch)
                
                preds = (outputs >= 0.5).float()
                correct += (preds == y_batch).sum().item()
                total_samples += len(y_batch)

        avg_loss = total_loss / total_samples if total_samples > 0 else 0.0
        accuracy = correct / total_samples if total_samples > 0 else 0.0
        
        return float(avg_loss), total_samples, {"accuracy": float(accuracy)}

# 4. Entry Point
if __name__ == "__main__":
    server_addr = args.server_address
    print(f"--- Initializing Hospital {args.node_id} Node ---")
    numpy_client = HospitalNodeClient(args.node_id)
    print(f"Connecting Hospital {args.node_id} to Server at {server_addr}...")
    
    fl.client.start_client(
        server_address=server_addr,
        client=numpy_client.to_client()
    )