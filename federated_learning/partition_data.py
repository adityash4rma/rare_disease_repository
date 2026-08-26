import os
import pandas as pd
import numpy as np

np.random.seed(42)
input_path = "data/synthetic/dataset.csv"

if not os.path.exists(input_path):
    raise FileNotFoundError(f"Could not find {input_path}")

# Auto-detect delimiter (comma, semicolon, tab, etc.)
try:
    df = pd.read_csv(input_path, sep=None, engine='python', encoding='utf-8')
except Exception:
    df = pd.read_csv(input_path, sep=None, engine='python', encoding='latin1')

print(f"Loaded master dataset with {len(df)} rows and {df.shape[1]} columns.")

df = df.sample(frac=1, random_state=42).reset_index(drop=True)

total_len = len(df)
split_a = int(total_len * 0.35)
split_b = int(total_len * 0.65)

df_a = df.iloc[:split_a]
df_b = df.iloc[split_a:split_b]
df_c = df.iloc[split_b:]

node_paths = {
    "a": "hospitals/hospital_a/hospital_a.csv",
    "b": "hospitals/hospital_b/hospital_b.csv",
    "c": "hospitals/hospital_c/hospital_c.csv"
}

for key, path in node_paths.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if key == 'a':
        df_a.to_csv(path, index=False)
    elif key == 'b':
        df_b.to_csv(path, index=False)
    elif key == 'c':
        df_c.to_csv(path, index=False)

print("Dataset partitioning complete!")