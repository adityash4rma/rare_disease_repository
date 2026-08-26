import flwr as fl
from typing import List, Tuple
from flwr.common import Metrics

def weighted_average(metrics: List[Tuple[int, Metrics]]) -> Metrics:
    """Aggregates accuracy metrics across hospitals weighted by sample count."""
    accuracies = [num_examples * m["accuracy"] for num_examples, m in metrics if "accuracy" in m]
    examples = [num_examples for num_examples, m in metrics if "accuracy" in m]
    
    if not examples or sum(examples) == 0:
        return {"accuracy": 0.0}
        
    return {"accuracy": sum(accuracies) / sum(examples)}

# Configure strategy to wait for all 3 hospital clients
strategy = fl.server.strategy.FedAvg(
    fraction_fit=1.0,
    fraction_evaluate=1.0,
    min_fit_clients=3,
    min_evaluate_clients=3,
    min_available_clients=3,
    evaluate_metrics_aggregation_fn=weighted_average,
)

if __name__ == "__main__":
    print("==================================================================")
    print(" Starting Federated Learning Server on 0.0.0.0:8090")
    print(" Waiting for Hospital Nodes A, B, and C to connect...")
    print("==================================================================")
    
    fl.server.start_server(
        server_address="0.0.0.0:8090",
        config=fl.server.ServerConfig(num_rounds=5),
        strategy=strategy,
    )