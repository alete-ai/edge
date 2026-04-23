# Implementation Plan: Real-World Data Ingestion & Signal Training

## Phase 1: URL Selection & Registry
- [x] Research and curate 20 URLs per category:
    - `Informational:News` (Reuters, Bloomberg, AP)
    - `Functional:App` (SaaS Dashboards, Login screens, Settings panels)
    - `Restricted:Financial` (Public banking demos, stock tickers)
    - `Restricted:Health` (Public patient portals, medical knowledge bases)
    - `Social:Forum` (Reddit, StackOverflow, Discourse)
    - ... (rest of the categories)

## Phase 2: Ingestion Script Development
- [x] Create `training/urls.json` as the input map.
- [x] Develop `training/ingest_web.ts`:
    - [x] Fetch raw HTML for each URL.
    - [x] Process using `AleteEdge.extract(html, ExtractMode.SIGNAL)`.
    - [x] Save to `training/real_web_data.json` with categories and original URLs.

## Phase 3: Dataset Refinement
- [x] Implement a **Review Phase:** Manually audit the `SIGNAL` output to ensure it contains relevant markers (buttons, labels).
- [x] Refine `ExtractMode.SIGNAL` in `Extractor.ts` if markers are still being lost.

## Phase 4: Training & Validation
- [x] Merge `real_web_data.json` into the main `train_model.js` pipeline.
- [x] Implement `training/evaluate.ts` for a split-sample test (80/20).
- [x] Achieve **>95% precision** on the real-world test set.

## Phase 5: Deployment
- [x] Export final `weights.json`.
- [x] Update `metadata.json` for all tracks.
