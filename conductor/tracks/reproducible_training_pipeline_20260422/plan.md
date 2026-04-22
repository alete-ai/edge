# Implementation Plan: Reproducible Training & Audit Pipeline

## Phase 1: Pipeline Unification
- [ ] Update `package.json` with a comprehensive `train` script:
    - `pnpm train:data`: Runs synthetic and web ingestion (if needed).
    - `pnpm train:model`: Runs `train_model.js`.
    - `pnpm train`: Orchestrates the full flow.
- [ ] Add a `clean` script to clear old reports or temporary datasets.

## Phase 2: Audit & Reporting
- [ ] Modify `training/train_model.js` to:
    - [ ] Calculate precision/recall using a held-out 10% validation set.
    - [ ] Generate a `training/reports/` directory if missing.
    - [ ] Write a timestamped JSON report containing:
        - Label Distribution.
        - Total Tokens.
        - Training Date.
        - `ExtractMode.SIGNAL` markers used.
        - Validation Metrics.

## Phase 3: Validation Integration
- [ ] Create `training/evaluate.ts` as a robust, non-synthetic test runner.
- [ ] Integrate reproduction tests directly into the `train` command to ensure no regressions.

## Phase 4: Final Verification
- [ ] Run `pnpm train` and verify the generation of both `weights.json` and the audit report.
- [ ] Audit the report content for "High-Signal" clarity.
