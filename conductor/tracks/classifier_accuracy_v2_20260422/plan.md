# Implementation Plan: Classifier Precision Upgrade (v2)

## Phase 1: Research & Diagnosis
- [x] Reproduce misclassifications using `test_reproduce.js`.
- [ ] **Audit Substrate Failure:**
    - [ ] Create `test_extraction_failure.js` to confirm `Readability` stripping dashboard content.
    - [ ] Analyze how `ignoredTags` (form, button, nav) are "blinding" the classifier to App signals.

## Phase 2: Pipeline Architecture Evolution (Multi-Pass)
- [ ] **Implement Multi-Pass Extraction in `AleteEdge.ts`:**
    - [ ] **Pass 1 (Signal Pass):** Fast extraction that strips junk (ads, scripts) but *preserves* UI markers (`form`, `button`, `input` labels) to feed the classifier.
    - [ ] **Pass 2 (Semantic Pass):** High-fidelity extraction optimized for the detected genre (e.g., using `Readability` for Research, but a structural approach for App/Dashboards).
- [ ] **Update `Extractor.ts` for Fidelity Modes:**
    - [ ] Add `ExtractMode` enum: `SIGNAL` (Preserve UI) vs `SEMANTIC` (Clean for LLM).
    - [ ] Refactor `extract()` to accept a mode and adjust `ignoredTags` and `Readability` usage accordingly.

## Phase 3: Data Refinement & Feature Engineering
- [ ] **Context-Aware Synthetic Generation:**
    - [ ] Add complex Markdown for `Functional:App` (Settings panels, profile links, button arrays).
- [ ] **Ingest Real Data:**
    - [ ] Integrate AG News or similar headline dataset to `training/fetch_dataset.py`.
    - [ ] Create `training/real_data/` and `training/ingest_real.ts` for library-parsed content.

## Phase 4: Retraining & Validation
- [ ] Run `pnpm tsx training/fetch_dataset.py` (Expand Substrate).
- [ ] Run `python training/generate_synthetic.py` (Enhance App/Functional).
- [ ] Run `pnpm tsx training/train_model.js` (Evolve Model).
- [ ] **Benchmarking:** 
    - [ ] Evaluate results using `test_reproduce.js`.
    - [ ] Create `training/evaluate.ts` to report precision (>95%) against "Gold Standard" real data.

## Phase 5: Strategy Audit & Migration (If needed)
- [ ] If accuracy is still <95%, investigate semantic migration (FastText, FFNN).

## Phase 6: Deployment & Monitoring
- [ ] Verify bundle size after weight export.
- [ ] Update documentation and classification benchmarks.
