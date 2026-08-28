# Rare Disease Repository

A federated, privacy-preserving repository platform for rare disease clinical and genomic datasets. Built with **FastAPI**, **React 19**, **Flower (`flwr`) Federated Learning**, **PyTorch**, and **FHIR R4** interoperability.

---

## 🌟 Features

- **Decentralized Data Sharing**: Federated Learning models train collaboratively across hospital nodes (Hospital A, B, C) without centralizing sensitive patient EHRs.
- **FHIR R4 Interoperability**: Automatic translation and generation of standardized HL7 FHIR Patient, Condition, and Observation resources.
- **Interactive Researcher Dashboard**: Explore disease repositories, active clinical trials, demographic distributions, and data access workflows.
- **Audit & Governance**: Cryptographic audit logging for data access requests, reviews, and contributions.
- **Containerized Deployment**: One-command local orchestration via Docker Compose.

---

## 🏗️ Architecture

```text
                               +-----------------------------+
                               |    React + Vite Frontend    |
                               |    Port 3000 (Nginx / Dev)  |
                               +--------------+--------------+
                                              |
                                              | REST API (JWT)
                                              v
                               +-----------------------------+
                               |     FastAPI Backend API     |
                               |     Port 8000 (SQLAlchemy)  |
                               +--------------+--------------+
                                              |
                     +------------------------+------------------------+
                     | gRPC Model Broadcast                            | gRPC Model Broadcast
                     v                                                 v
       +---------------------------+                     +---------------------------+
       |   Flower FL Aggregator    |                     |   Hospital Client Nodes   |
       |   server.py (Port 8090)   | <=================> |   Node A, B, and C        |
       +---------------------------+   Weights Transfer  +---------------------------+
```

---

## 🚀 Quick Start

### Option 1: Run with Docker Compose

```bash
# Build and run all services (Frontend, Backend, FL Server, Hospital Nodes)
docker compose up --build -d

# View live logs
docker compose logs -f
```

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **FastAPI Interactive Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **FL Server**: `localhost:8090`

---

### Option 2: Local Development

#### 1. Backend Setup
```bash
# Activate virtual environment
.\backend\venv\Scripts\activate      # Windows
# source backend/venv/bin/activate   # Linux/macOS

# Seed database with sample rare disease data
python -m backend.seed_data

# Start FastAPI server
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### 3. Federated Learning Simulation
```bash
# Generate sample partitioned hospital datasets
python data/synthetic/generate_data.py

# In Terminal 1: Start FL central server
python federated_learning/server.py

# In Terminals 2, 3, 4: Start hospital clients
python federated_learning/local_hospital_node.py --node-id A
python federated_learning/local_hospital_node.py --node-id B
python federated_learning/local_hospital_node.py --node-id C
```

---

## 📂 Project Structure

```text
rare_disease_repository/
├── backend/                  # FastAPI REST API, SQLAlchemy models & schemas
├── frontend/                 # React 19 + TypeScript + Vite + Tailwind UI
├── federated_learning/       # Flower FL server, PyTorch models & hospital clients
├── data/synthetic/           # Synthetic dataset generator & partitions
├── hospitals/                # Local hospital node CSV storage
├── docker/                   # Frontend Dockerfile & Nginx proxy config
├── docker-compose.yml        # Multi-service container orchestration
└── Dockerfile                # Multi-purpose Python backend & FL container
```

---

## 🔐 Default Credentials (After Seeding)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@raredisease.org` | `admin123` |
| **Researcher** | `sarah.chen@nih.gov` | `password123` |
| **Clinician** | `e.watson@gosh.nhs.uk` | `password123` |
