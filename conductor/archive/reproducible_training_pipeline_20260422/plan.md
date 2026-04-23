# Implementation Plan: Reproducible Training & Audit Pipeline

## Phase 1: Pipeline Unification
- [x] Update `package.json` with a comprehensive `train` script:
    - [x] `pnpm train:data`: Runs synthetic and web ingestion (if needed).
    - [x] `pnpm train:model`: Runs `train_model.js`.
    - [x] `pnpm train`: Orchestrates the full flow.
- [x] Add a `clean` script to clear old reports or temporary datasets.

## Phase 2: Audit & Reporting
- [x] Modify `training/train_model.js` to:
    - [x] Calculate precision/recall using a held-out 10% validation set.
    - [x] Generate a `training/reports/` directory if missing.
    - [x] Write a timestamped JSON report containing:
        - Label Distribution.
        - Total Tokens.
        - Training Date.
        - `ExtractMode.SIGNAL` markers used.
        - Validation Metrics.

## Phase 3: Validation Integration
- [x] Create `training/evaluate.ts` as a robust, non-synthetic test runner.
- [x] Integrate reproduction tests directly into the `train` command to ensure no regressions.

## Phase 4: Final Verification
- [x] Run `pnpm train` and verify the generation of both `weights.json` and the audit report.
- [x] Audit the report content for "High-Signal" clarity.
