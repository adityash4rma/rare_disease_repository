import flwr as fl
from typing import List, Tuple
from flwr.common import Weights, Scalar

class CustomFedAvg(fl.server.strategy.FedAvg):
    def aggregate_fit(
        self,
        server_round: int,
        results: List[Tuple[fl.server.client_proxy.ClientProxy, fl.common.FitRes]],
        failures: List[BaseException],
    ):
        """
        Receives model outputs (parameters) from local hospital nodes 
        and computes weighted average for the global model.
        """
        if not results:
            return None, {}

        # Aggregate parameters sent from local nodes using FedAvg strategy
        aggregated_parameters, metrics = super().aggregate_fit(server_round, results, failures)

        if aggregated_parameters is not None:
            print(f"--- Round {server_round}: Successfully aggregated local updates into Global Model ---")

        return aggregated_parameters, metrics

def start_global_aggregator():
    strategy = CustomFedAvg(
        min_fit_clients=3,        # Requires updates from Hospital A, B, and C
        min_available_clients=3,
    )

    fl.server.start_server(
        server_address="0.0.0.0:8080",
        config=fl.server.ServerConfig(num_rounds=5),
        strategy=strategy,
    )

if __name__ == "__main__":
    start_global_aggregator()