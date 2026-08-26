import argparse
import os
import pandas as pd
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset
from collections import OrderedDict
import flwr as fl

# 1. Parse CLI Arguments
parser = argparse.ArgumentParser(description="Hospital Node Client for Federated Learning")
parser.add_argument("--node-id", type=str, required=True, help="Hospital Node ID (e.g., A, B, or C)")
args = parser.parse_args()

# 2. Robust Local CSV Data Loader
def load_local_data(node_id):
    file_path = f"hospitals/hospital_{node_id.lower()}/hospital_{node_id.lower()}.csv"
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Dataset for Node '{node_id}' not found at {file_path}. Run partition_data.py first.")
    
    try:
        df = pd.read_csv(file_path, sep=None, engine='python', encoding='utf-8', on_bad_lines='skip')
    except Exception:
        df = pd.read_csv(file_path, sep=None, engine='python', encoding='latin1', on_bad_lines='skip')

    for col in df.columns:
        if df[col].dtype == 'object':
            df[col] = pd.factorize(df[col])[0]

    df = df.fillna(0)
    
    X_raw = df.iloc[:, :-1].values.astype(np.float32)
    y_raw = df.iloc[:, -1].values
    
    # Ensure binary classification targets are strictly 0.0 or 1.0 for BCELoss
    y_raw = np.where(y_raw > 0, 1.0, 0.0).astype(np.float32)

    X = torch.tensor(X_raw, dtype=torch.float32)
    y = torch.tensor(y_raw, dtype=torch.float32).unsqueeze(1)

    dataset = TensorDataset(X, y)
    loader = DataLoader(dataset, batch_size=32, shuffle=True)
    return loader, X.shape[1]

# 3. Flower NumPy Client Definition
class HospitalNodeClient(fl.client.NumPyClient):
    def __init__(self, node_id):
        self.node_id = node_id
        self.train_loader, num_features = load_local_data(node_id)
        
        self.model = nn.Sequential(
            nn.Linear(num_features, 64),
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 1),
            nn.Sigmoid()
        )
        self.criterion = nn.BCELoss()
        self.optimizer = torch.optim.Adam(self.model.parameters(), lr=0.001)

    def get_parameters(self, config):
        return [val.cpu().numpy() for _, val in self.model.state_dict().items()]

    def set_parameters(self, parameters):
        params_dict = zip(self.model.state_dict().keys(), parameters)
        state_dict = OrderedDict({k: torch.tensor(v) for k, v in params_dict})
        self.model.load_state_dict(state_dict, strict=True)

    def fit(self, parameters, config):
        try:
            self.set_parameters(parameters)
            self.model.train()
            
            for epoch in range(2):
                for x_batch, y_batch in self.train_loader:
                    self.optimizer.zero_grad()
                    outputs = self.model(x_batch)
                    loss = self.criterion(outputs, y_batch)
                    loss.backward()
                    self.optimizer.step()
                    
            return self.get_parameters(config={}), len(self.train_loader.dataset), {}
        except Exception as e:
            print(f"ERROR during local fit on Node {self.node_id}: {e}")
            raise e

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
    print(f"--- Initializing Hospital {args.node_id} Node ---")
    numpy_client = HospitalNodeClient(args.node_id)
    print(f"Connecting Hospital {args.node_id} to Server at 127.0.0.1:8090...")
    
    fl.client.start_client(
        server_address="127.0.0.1:8090",
        client=numpy_client.to_client()
    )