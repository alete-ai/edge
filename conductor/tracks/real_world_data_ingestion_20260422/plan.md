# Implementation Plan: Real-World Data Ingestion & Signal Training

## Phase 1: URL Selection & Registry
- [ ] Research and curate 20 URLs per category:
    - `Informational:News` (Reuters, Bloomberg, AP)
    - `Functional:App` (SaaS Dashboards, Login screens, Settings panels)
    - `Restricted:Financial` (Public banking demos, stock tickers)
    - `Restricted:Health` (Public patient portals, medical knowledge bases)
    - `Social:Forum` (Reddit, StackOverflow, Discourse)
    - ... (rest of the categories)

## Phase 2: Ingestion Script Development
- [ ] Create `training/urls.json` as the input map.
- [ ] Develop `training/ingest_web.ts`:
    - [ ] Fetch raw HTML for each URL.
    - [ ] Process using `AleteEdge.extract(html, ExtractMode.SIGNAL)`.
    - [ ] Save to `training/real_web_data.json` with categories and original URLs.

## Phase 3: Dataset Refinement
- [ ] Implement a **Review Phase:** Manually audit the `SIGNAL` output to ensure it contains relevant markers (buttons, labels).
- [ ] Refine `ExtractMode.SIGNAL` in `Extractor.ts` if markers are still being lost.

## Phase 4: Training & Validation
- [ ] Merge `real_web_data.json` into the main `train_model.js` pipeline.
- [ ] Implement `training/evaluate.ts` for a split-sample test (80/20).
- [ ] Achieve **>95% precision** on the real-world test set.

## Phase 5: Deployment
- [ ] Export final `weights.json`.
- [ ] Update `metadata.json` for all tracks.
