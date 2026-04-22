# Track: Classifier Precision Upgrade (v2)

This track focuses on retraining and potentially migrating the content classifier to resolve critical misclassifications reported in the field.

## Navigation
- [Specification](./spec.md)
- [Implementation Plan](./plan.md)
- [Metadata](./metadata.json)

## Status
- **Phase:** Phase 1: Research & Diagnosis
- **Progress:** Reproduction confirmed. Moving to data refinement.

## Key Artifacts
- `training/fetch_dataset.py`: Multi-source data ingestion.
- `training/generate_synthetic.py`: Synthetic feature generation.
- `training/train_model.js`: Model training and weights export.
- `src/model/weights.json`: Exported classifier weights.
- `test_reproduce.js`: Local reproduction and verification script.
