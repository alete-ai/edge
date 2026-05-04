# AleteEdge: Model Training Lab

This directory contains the infrastructure and pipelines used to train, quantize, and verify the AleteEdge classification engine.

## Overview

AleteEdge utilizes a distilled **Model2Vec** architecture. The training process involves three primary stages:
1. **Data Ingestion:** Gathering real-world web content (HTML) and synthetic samples.
2. **Model Distillation:** Training a lightweight MLP head on top of frozen semantic embeddings.
3. **Model Quantization:** Quantizing the model to Int4 for edge efficiency.

## Training Pipeline

The entire pipeline is orchestrated via the root `package.json`:

```bash
# Run the full training & quantization cycle
pnpm train
```

### Individual Steps

- **`train:data:synthetic`**: Generates high-quality synthetic samples for bootstrapping.
- **`train:data:web`**: Ingests real-world HTML from `training/urls.json` and produces `real_web_data.json`.
- **`train:model`**: Distills the Model2Vec architecture and trains the classification head.
- **`train:quantize`**: Compresses the Float32 weights into a 1.8MB Int4 binary.

## Parity Verification

The training lab includes an audit suite to ensure cross-platform parity:

- **`training/audit_inference.ts`**: Runs a battery of tests against the JS engine.
- **`scripts/generate_parity_data.ts`**: Exports test cases as JSON for the Swift implementation to consume, ensuring bit-perfect parity between JS and Swift.

## Asset Structure

- `m2v_distilled/`: The base distilled model.
- `reports/`: Training reports tracking accuracy, F1-scores, and latency for every training run.
- `urls.json`: The global registry of real-world "raw" data sources.

## License

AGPL-3.0 - Copyright (c) 2026 [Alete Inc.](https://alete.ai/)
