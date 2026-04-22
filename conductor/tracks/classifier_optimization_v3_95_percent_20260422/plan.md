# Implementation Plan: Classifier Precision Optimization (>95%)

## Phase 1: Research & Substrate Analysis
- [ ] **Semantic Benchmark:** Test `FastText` vs current `Naive Bayes` on the 69-sample real-world dataset.
- [ ] **Structural Signal Audit:** 
    - [ ] Modify `Extractor.ts` to output a `SignalMetadata` object (button count, link count, char count).
    - [ ] Analyze if these metadata features improve separation between "Blog" and "Research."

## Phase 2: Massive Data Ingestion
- [ ] Scale `urls.json` to 100+ high-signal URLs per category.
- [ ] Run `pnpm train:data:web` to build a 1000+ sample "Wild-type" dataset.
- [ ] **Data Augmentation:** Implement a script to generate "Genetic Variations" of real samples (swapping synonyms, shuffling structural markers).

## Phase 3: Semantic Migration (The Neural Upgrade)
- [ ] Implement the selected Semantic Classifier (FastText/FFNN).
- [ ] Integrate into `src/classifier.ts`.
- [ ] Verify **<10ms latency** on local hardware.

## Phase 4: Validation & Tuning
- [ ] Run `pnpm train`.
- [ ] Achieve **>95% overall accuracy** in the Genomic Report.
- [ ] Perform a "Live Fire" test on un-seen URLs.

## Phase 5: Documentation & Article Prep
- [ ] Update `PROGRESS_REPORT.md`.
- [ ] Capture "Confusion Matrices" for the planned technical article.
