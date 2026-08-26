# Federated Learning Module — Rare Disease Repository

A privacy-preserving, decentralized machine learning engine built with **Flower (`flwr`)** and **PyTorch**. This module enables collaborative model training across isolated hospital nodes (Hospital A, B, and C) for rare disease classification without aggregating sensitive patient datasets into a central server.

## Technical Architecture

The system uses a client-server architecture with gRPC for exchanging model parameters while keeping raw patient data local to each hospital.

```text
                           +-------------------------------+
                           |     Central FL Aggregator     |
                           |     server.py (Port 8090)     |
                           |       Strategy: FedAvg        |
                           |          5 Rounds             |
                           +---------------+---------------+
                                           |
             +-----------------------------+-----------------------------+
             | gRPC (Model Weights)        | gRPC (Model Weights)        | gRPC (Model Weights)
             v                             v                             v
+------------------------+    +------------------------+    +------------------------+
|    Hospital Node A     |    |    Hospital Node B     |    |    Hospital Node C     |
| local_hospital_node.py |    | local_hospital_node.py |    | local_hospital_node.py |
| Dataset: hospital_a    |    | Dataset: hospital_b    |    | Dataset: hospital_c    |
+------------------------+    +------------------------+    +------------------------+
```

## Core Workflow

1. **Server Launch:** The central server initializes the `FedAvg` strategy and listens on port `8090`.
2. **Global Parameter Broadcast:** The initial global model weights are sent to connected hospital clients.
3. **Local Training:** Each hospital trains the PyTorch neural network locally on its private CSV dataset for 2 epochs per round.
4. **Weight Aggregation:** Clients return updated model weights and sample counts. The server performs a weighted average:

   $$\theta_{t+1} = \sum_{k=1}^{K} \frac{n_k}{N}\theta_{t+1}^{k}$$

5. **Iterative Optimization:** The broadcast → local training → aggregation cycle repeats for 5 federated rounds.
6. **Evaluation:** Hospital evaluation metrics are aggregated using sample-weighted accuracy.

## Project Structure

```text
federated_learning/
├── __init__.py
├── server.py
├── local_hospital_node.py
├── partition_data.py
└── README.md
```

Expected hospital data directories:

```text
hospitals/
├── hospital_a/
├── hospital_b/
└── hospital_c/
```

## Components

### `server.py`

**Role:** Central federated learning orchestrator.

Key configuration:

- **Port:** `8090`
- **Rounds:** `5`
- **Strategy:** `flwr.server.strategy.FedAvg`
- **Minimum fit clients:** `3`
- **Minimum available clients:** `3`
- **Aggregation:** Sample-weighted model parameters
- **Metrics:** Sample-weighted hospital accuracy

The server does **not** receive raw patient records. It only coordinates model training and aggregates model parameters.

### `local_hospital_node.py`

**Role:** Hospital-side Flower client and PyTorch trainer.

Run with:

```powershell
python federated_learning/local_hospital_node.py --node-id A
```

Supported node IDs:

```text
A
B
C
```

Features:

- Loads hospital-specific CSV data locally.
- Supports `utf-8` and `latin1` CSV encodings.
- Uses `on_bad_lines='skip'` as a fallback for malformed rows.
- Converts target values to binary `0.0` / `1.0` values for `BCELoss`.
- Uses the modern Flower `NumPyClient` API with `.to_client()`.
- Sends model parameters instead of raw clinical records.

### `partition_data.py`

**Role:** Dataset preparation and hospital partitioning.

It splits the source clinical dataset into hospital-specific datasets:

```text
hospitals/hospital_a/
hospitals/hospital_b/
hospitals/hospital_c/
```

Run:

```powershell
python federated_learning/partition_data.py
```

> Review the partitioning logic before using real clinical data. In a production healthcare deployment, data partitioning should reflect realistic hospital distributions and governance requirements.

## Model Architecture

The local model is a Feedforward Neural Network (FNN):

```text
Input Features
      |
      v
Linear(num_features → 64)
      |
     ReLU
      |
      v
Linear(64 → 32)
      |
     ReLU
      |
      v
Linear(32 → 1)
      |
    Sigmoid
      |
      v
Disease Probability
```

### Training Configuration

| Parameter | Value |
|---|---|
| Framework | PyTorch |
| Federated Framework | Flower (`flwr`) |
| Model | Feedforward Neural Network |
| Hidden Layer 1 | 64 neurons |
| Hidden Layer 2 | 32 neurons |
| Output | 1 neuron |
| Activation | ReLU + Sigmoid |
| Loss | `nn.BCELoss()` |
| Optimizer | Adam |
| Learning Rate | `0.001` |
| Batch Size | `32` |
| Local Epochs | `2` |
| Federated Rounds | `5` |
| Hospital Nodes | `3` |
| Server Port | `8090` |

## Prerequisites

Recommended environment:

- Python 3.9+
- PyTorch
- Flower
- NumPy
- Pandas

Install dependencies:

```powershell
pip install torch flwr numpy pandas
```

If your project already contains a `requirements.txt`, install it with:

```powershell
pip install -r requirements.txt
```

## Step-by-Step Execution

The system is designed to run using **4 separate PowerShell terminals** from the project root.

### Step 1 — Partition the Dataset

Run once:

```powershell
python federated_learning/partition_data.py
```

Verify that the hospital datasets have been created:

```text
hospitals/
├── hospital_a/
├── hospital_b/
└── hospital_c/
```

### Step 2 — Start the Federated Server

Open **Terminal 1**:

```powershell
python federated_learning/server.py
```

Expected startup output:

```text
==================================================================
 Starting Federated Learning Server on 0.0.0.0:8090
 Waiting for Hospital Nodes A, B, and C to connect...
==================================================================
```

### Step 3 — Start Hospital A

Open **Terminal 2**:

```powershell
python federated_learning/local_hospital_node.py --node-id A
```

### Step 4 — Start Hospital B

Open **Terminal 3**:

```powershell
python federated_learning/local_hospital_node.py --node-id B
```

### Step 5 — Start Hospital C

Open **Terminal 4**:

```powershell
python federated_learning/local_hospital_node.py --node-id C
```

After all three hospital nodes connect, the server automatically performs:

```text
Round 1
   ↓
Round 2
   ↓
Round 3
   ↓
Round 4
   ↓
Round 5
   ↓
Final Aggregated Metrics
```

## Federated Learning Data Flow

```text
                  CENTRAL SERVER
                       |
             Initial Global Model
                       |
        +--------------+--------------+
        |              |              |
        v              v              v
   Hospital A     Hospital B     Hospital C
        |              |              |
   Private Data   Private Data   Private Data
        |              |              |
   Local Training Local Training Local Training
        |              |              |
   Updated Weights Updated Weights Updated Weights
        +--------------+--------------+
                       |
                       v
                 FedAvg Aggregation
                       |
                       v
              Updated Global Model
                       |
                 Next FL Round
```

## Privacy Model

The federated setup is designed so that:

- Raw patient records remain inside each hospital node.
- The central server receives model parameters rather than the raw datasets.
- Each hospital independently performs local training.
- The server aggregates model updates using FedAvg.
- Hospital datasets are not merged into a single central training database.

> **Important:** Federated learning improves data locality, but it is not automatically a complete privacy guarantee. Production deployments should additionally consider secure aggregation, encryption in transit, authentication, access control, differential privacy, audit logging, and appropriate healthcare/data-protection requirements.

## Target Binarization

`BCELoss` expects target values in the range `[0, 1]`.

If the dataset contains target values such as:

```text
0, 1, 2, 3, ...
```

the loader converts them into binary labels:

```python
np.where(y_raw > 0, 1.0, 0.0)
```

Therefore:

```text
0 → 0.0
1 → 1.0
2 → 1.0
3 → 1.0
...
```

Make sure this transformation matches the actual meaning of the target variable before using the model for research or clinical applications.

## Troubleshooting

### 1. Port 8090 Already in Use

Error:

```text
RuntimeError: Failed to bind to address 0.0.0.0:8090
```

Find and terminate the process using port `8090`:

```powershell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 8090).OwningProcess -Force
```

Then restart:

```powershell
python federated_learning/server.py
```

### 2. Check Whether Port 8090 Is in Use

```powershell
Get-NetTCPConnection -LocalPort 8090
```

If there is no active connection, the port should be available.

### 3. Flower Client API Warning

The client uses:

```python
numpy_client.to_client()
```

with:

```python
flwr.client.start_client()
```

This follows the current Flower client pattern and avoids older client API usage.

### 4. CSV Encoding Error

The local data loader attempts:

```text
UTF-8
   ↓
Latin-1 fallback
```

Malformed rows can be skipped using:

```python
on_bad_lines='skip'
```

However, skipped records should be investigated before using the system for serious model evaluation.

### 5. Hospital Node Does Not Connect

Check:

- The server is running first.
- Port `8090` is available.
- All terminals are running from the project root.
- The node ID is exactly `A`, `B`, or `C`.
- The local hospital dataset exists.
- Python and Flower are installed in the same environment.

## Example Command Summary

### Partition data

```powershell
python federated_learning/partition_data.py
```

### Start server

```powershell
python federated_learning/server.py
```

### Start Hospital A

```powershell
python federated_learning/local_hospital_node.py --node-id A
```

### Start Hospital B

```powershell
python federated_learning/local_hospital_node.py --node-id B
```

### Start Hospital C

```powershell
python federated_learning/local_hospital_node.py --node-id C
```

## Research/Production Considerations

This module is intended as a prototype/research component for a decentralized rare-disease repository.

For a production healthcare environment, consider adding:

- TLS/mTLS for node authentication and encrypted communication.
- Secure aggregation.
- Differential privacy.
- Hospital/node authentication.
- Role-based access control.
- Model update validation.
- Audit logs.
- Model versioning.
- Data and model provenance.
- FHIR/HL7 integration.
- DICOM integration where medical imaging is involved.
- Robustness against malicious or poisoned client updates.
- Monitoring for model drift and performance changes.
- Appropriate regulatory and institutional review.

## Module Objective

The goal of this module is to demonstrate how multiple hospitals can collaboratively train a rare-disease classification model while keeping their sensitive clinical datasets decentralized.

```text
Private Hospital Data
        ↓
Local Model Training
        ↓
Model Parameters
        ↓
Federated Aggregation
        ↓
Global Model
        ↓
Improved Disease Classification
```

This architecture forms the **Federated Learning layer** of the broader Rare Disease Repository and can be integrated with decentralized identity, clinical data standards, secure storage, and the repository's web/API layer.
