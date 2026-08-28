import os
import torch
import flwr as fl
from typing import List, Tuple, Dict, Optional
from flwr.common import Parameters, Scalar
from backend.model_def import RareDiseaseNet

class SaveModelStrategy(fl.server.strategy.FedAvg):
    def aggregate_fit(
        self,
        server_round: int,
        results: List[Tuple[fl.server.client_proxy.ClientProxy, fl.common.FitRes]],
        failures: List[BaseException],
    ) -> Tuple[Optional[Parameters], Dict[str, Scalar]]:
        aggregated_parameters, metrics = super().aggregate_fit(server_round, results, failures)
        
        if aggregated_parameters is not None:
            print(f"--- Saving Global Model Checkpoint for Round {server_round} ---")
            # Convert Flower parameters to NumPy arrays
            aggregated_weights = fl.common.parameters_to_ndarrays(aggregated_parameters)
            
            # Load weights into PyTorch model structure
            model = RareDiseaseNet(input_dim=10)
            params_dict = zip(model.state_dict().keys(), aggregated_weights)
            state_dict = {k: torch.tensor(v) for k, v in params_dict}
            model.load_state_dict(state_dict, strict=True)
            
            # Save trained model state
            os.makedirs("backend/saved_models", exist_ok=True)
            torch.save(model.state_dict(), "backend/saved_models/global_model.pt")
            print("Successfully exported global_model.pt to backend/saved_models/")

        return aggregated_parameters, metrics

if __name__ == "__main__":
    strategy = SaveModelStrategy(
        fraction_fit=1.0,
        min_fit_clients=3,
        min_available_clients=3,
    )
    print("Starting Central FL Server on port 8090...")
    fl.server.start_server(
        server_address="0.0.0.0:8090",
        config=fl.server.ServerConfig(num_rounds=5),
        strategy=strategy,
    )
