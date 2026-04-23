# Specification: Reproducible Training & Audit Pipeline

## Overview
To ensure the long-term "Structural Resilience" of our classifier, we must move from manual scripts to a unified, auditable training pipeline. Every training run should produce not only the model weights but also a timestamped "Genomic Report" detailing the training conditions, label distribution, and validation metrics.

## Objectives
- [ ] **Unified Command:** Implement `pnpm train` to handle synthetic generation, web ingestion (optional/cached), and retraining.
- [ ] **Auditable Artifacts:** Generate a `training/reports/run_<timestamp>.json` for every training session.
- [ ] **Feature Snapshot:** Include the current `ExtractMode` and label mappings in the report to track "Phenotypic Evolution."
- [ ] **Automated Validation:** Integrate `test_reproduce.js` and `test_extraction_fidelity.js` into the final phase of the training script.

## Core Frameworks
- **CLI Wrapper:** `package.json` scripts.
- **Audit Logger:** New logic in `train_model.js`.
- **Validation Suite:** Unified `evaluate.ts`.

## Success Metrics (Survival Metrics)
- `pnpm train` consistently produces valid `weights.json`.
- Each training run is accompanied by a human-readable JSON report.
- The report includes precision/recall estimates for all 13 categories.
