import os
import csv
import random

def generate_synthetic_dataset(output_path="data/synthetic/dataset.csv", num_samples=300):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    random.seed(42)

    headers = [
        'fev1_score', 'sweat_chloride', 'cftr_variant_severity', 
        'crp_inflammation', 'bmi', 'alt_enzyme', 'ast_enzyme', 
        'age', 'hospital_id', 'biomarker_x', 'disease_target'
    ]

    rows = []
    for _ in range(num_samples):
        fev1 = round(random.gauss(75, 15), 2)
        sweat_cl = round(random.gauss(60, 20), 2)
        cftr = random.choice([0, 1, 2, 3])
        crp = round(random.expovariate(0.2), 2)
        bmi = round(random.gauss(21, 4), 2)
        alt = round(random.gauss(35, 12), 2)
        ast = round(random.gauss(32, 10), 2)
        age = random.randint(2, 65)
        hosp_id = random.choice([1, 2, 3])
        biomarker = round(random.uniform(0.1, 5.0), 2)

        risk_score = (
            (2 if sweat_cl > 60 else 0) +
            (2 if fev1 < 70 else 0) +
            cftr +
            (1 if crp > 6 else 0)
        )
        target = 1 if risk_score >= 3 else 0

        rows.append([
            fev1, sweat_cl, cftr, crp, bmi, alt, ast, age, hosp_id, biomarker, target
        ])

    with open(output_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)

    print(f"Generated synthetic dataset with {len(rows)} records at: {output_path}")

    # Partition for hospital nodes
    split_a = int(num_samples * 0.35)
    split_b = int(num_samples * 0.65)
    
    node_data = {
        'a': rows[:split_a],
        'b': rows[split_a:split_b],
        'c': rows[split_b:]
    }

    for node_id, data in node_data.items():
        path = f"hospitals/hospital_{node_id}/hospital_{node_id}.csv"
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(headers)
            writer.writerows(data)
        print(f"Created node dataset: {path} ({len(data)} rows)")

if __name__ == "__main__":
    generate_synthetic_dataset()
