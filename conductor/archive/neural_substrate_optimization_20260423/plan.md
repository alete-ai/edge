# Implementation Plan: Neural Substrate Optimization

## Phase 1: Substrate Preparation & Baseline
- [x] Record baseline accuracy and bucket performance (90.43%)
- [x] Implement `training/audit_inference.ts` to run local classification audit on existing assets.

## Phase 2: Metabolic Optimization (Asset Externalization)
- [x] Refactor `tsup.config.ts` to copy `src/model/*` to `dist/model/` instead of inlining.
- [x] Update `Model2VecEngine` to use dynamic path resolution via `import.meta.url`.
- [x] Verify "zero-config" path resolution in both Node.js and Browser/Vitest environments.
- [x] Measure size reduction from removing Base64 overhead (~33% of 14MB = ~4.6MB savings).

## Phase 3: Substrate Condensation (Quantization)
- [x] Develop quantization script `training/quantize_embeddings.ts`.
- [x] Side-by-side Audit using `training/audit_inference.ts`:
  - [x] Benchmark **Int8**: 3.6MB @ 96.54% Accuracy.
  - [x] Benchmark **Int4**: 1.8MB @ 96.14% Accuracy.
- [x] Implement Standard Int4 Export:
  - [x] Set `m2v_embeddings.bin` as Int4 substrate.
  - [x] Simplify `Model2VecEngine` to always use Int4.
- [x] Standardize `AleteEdge` to use the optimized substrate.
- [x] Automate quantization in `pnpm train`.

## Phase 4: Validation & Mythos Recording
- [x] Run full test suite (`pnpm test`).
- [x] Update `README.md` with Int4 performance metrics (96.14% Accuracy @ 1.8MB).
- [x] Update `PROGRESS_REPORT.md` with the "Great Condensation" results.
- [x] Finalize Conductor track and archive.
