import os
import torch
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.model_def import RareDiseaseNet

router = APIRouter(prefix="/api", tags=["Prediction"])

MODEL_PATH = "backend/saved_models/global_model.pt"

class PatientData(BaseModel):
    features: list[float]  # Expects 10 numerical clinical features

@router.post("/predict")
async def predict_risk(patient: PatientData):
    if len(patient.features) != 10:
        raise HTTPException(status_code=400, detail="Expected 10 clinical feature inputs.")
    
    if not os.path.exists(MODEL_PATH):
        raise HTTPException(status_code=500, detail="Global model weights not found. Run FL training first.")

    # Load global PyTorch model
    model = RareDiseaseNet(input_dim=10)
    model.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device("cpu")))
    model.eval()

    # Perform inference
    with torch.no_grad():
        input_tensor = torch.tensor([patient.features], dtype=torch.float32)
        prediction_prob = model(input_tensor).item()

    risk_level = "High Risk" if prediction_prob >= 0.5 else "Low Risk"

    return {
        "status": "success",
        "probability": round(prediction_prob, 4),
        "risk_level": risk_level
    }
