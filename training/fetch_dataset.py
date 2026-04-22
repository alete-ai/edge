import os
import json
from datasets import load_dataset
import pandas as pd
from tqdm import tqdm

def fetch_datasets():
    print("Fetching multi-source datasets from HuggingFace...")
    all_data = []

    # 1. X-GENRE for core genres
    print("-> Loading X-GENRE...")
    x_genre = load_dataset("TajaKuzmanPungersek/X-GENRE-text-genre-dataset", "train")['train']
    for item in tqdm(x_genre, desc="X-GENRE"):
        all_data.append({"text": item['text'], "label": item['labels'], "source": "x-genre"})

    # 2. MTSamples for Medical
    print("-> Loading MTSamples (Medical)...")
    try:
        medical = load_dataset("tner/mtsamples", trust_remote_code=True)['train']
        for item in tqdm(medical.select(range(min(500, len(medical)))), desc="Medical"):
            # Combine tokens for MTSamples
            text = " ".join(item['tokens'])
            all_data.append({"text": text, "label": "Restricted:Health", "source": "mtsamples"})
    except Exception as e:
        print(f"Skipping MTSamples due to error: {e}")

    # 3. PII samples (ai4privacy subset)
    print("-> Loading PII Signals...")
    try:
        pii = load_dataset("ai4privacy/pii-masking-300k", split="train", streaming=True)
        # Take a small representative sample
        pii_count = 0
        for item in tqdm(pii, total=500, desc="PII"):
            all_data.append({"text": item['text'], "label": "Restricted:PII", "source": "pii-masking"})
            pii_count += 1
            if pii_count >= 500: break
    except Exception as e:
        print(f"Skipping PII due to error: {e}")

    # 4. Bank Transaction signals
    print("-> Loading Financial Signals...")
    try:
        financial = load_dataset("DoDataThings/us-bank-transaction-categories-v2", split="train")
        for item in tqdm(financial.select(range(min(500, len(financial)))), desc="Financial"):
            all_data.append({"text": item['description'], "label": "Restricted:Financial", "source": "bank-transactions"})
    except Exception as e:
        print(f"Skipping Financial due to error: {e}")

    output_path = os.path.join(os.path.dirname(__file__), "dataset.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)
    
    print(f"Saved {len(all_data)} samples to {output_path}")

if __name__ == "__main__":
    fetch_datasets()
