# Implementation Plan: Classifier Precision Upgrade (v2)

## Phase 1: Research & Diagnosis
- [x] Reproduce misclassifications using `test_reproduce.js`.
- [x] **Audit Substrate Failure:**
    - [x] Create `test_extraction_failure.js` to confirm `Readability` stripping dashboard content.
    - [x] Analyze how `ignoredTags` (form, button, nav) are "blinding" the classifier to App signals.

## Phase 2: Pipeline Architecture Evolution (Multi-Pass)
- [x] **Implement Multi-Pass Extraction in `AleteEdge.ts`:**
    - [x] **Pass 1 (Signal Pass):** Fast extraction that strips junk (ads, scripts) but *preserves* UI markers (`form`, `button`, `input` labels) to feed the classifier.
    - [x] **Pass 2 (Semantic Pass):** High-fidelity extraction optimized for the detected genre (e.g., using `Readability` for Research, but a structural approach for App/Dashboards).
- [x] **Update `Extractor.ts` for Fidelity Modes:**
    - [x] Add `ExtractMode` enum: `SIGNAL` (Preserve UI) vs `SEMANTIC` (Clean for LLM).
    - [x] Refactor `extract()` to accept a mode and adjust `ignoredTags` and `Readability` usage accordingly.

## Phase 3: Data Refinement & Feature Engineering
- [x] **Context-Aware Synthetic Generation:**
    - [x] Add complex Markdown for `Functional:App` (Settings panels, profile links, button arrays).
- [x] **Ingest Real Data:**
    - [x] Integrate AG News or similar headline dataset to `training/fetch_dataset.py`.
    - [x] Create `training/real_data/` and `training/ingest_real.ts` for library-parsed content.

## Phase 4: Retraining & Validation
- [x] Run `pnpm tsx training/fetch_dataset.py` (Expand Substrate).
- [x] Run `python training/generate_synthetic.py` (Enhance App/Functional).
- [x] Run `pnpm tsx training/train_model.js` (Evolve Model).
- [x] **Benchmarking:** 
    - [x] Evaluate results using `test_reproduce.js`.
    - [x] Create `training/evaluate.ts` to report precision (>95%) against "Gold Standard" real data.

## Phase 5: Strategy Audit & Migration (If needed)
- [x] If accuracy is still <95%, investigate semantic migration (FastText, FFNN).

## Phase 6: Deployment & Monitoring
- [x] Verify bundle size after weight export.
- [x] Update documentation and classification benchmarks.
