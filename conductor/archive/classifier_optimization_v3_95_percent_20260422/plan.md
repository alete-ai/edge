# Implementation Plan: Classifier Precision Optimization (>95%)

## Phase 1: Research & Substrate Analysis
- [x] **Semantic Benchmark:** Test `FastText` vs current `Naive Bayes` on the 69-sample real-world dataset. (Naive Bayes + Bigrams + Metadata reaches 88%).
- [x] **Structural Signal Audit:** 
    - [x] Modify `Extractor.ts` to output a `SignalMetadata` object (button count, link count, char count).
    - [x] Analyze if these metadata features improve separation between "Blog" and "Research." (Result: Accuracy jumped from 71% to 88%).

## Phase 2: Massive Data Ingestion
- [x] Scale `urls.json` to 100+ high-signal URLs per category.
- [x] Run `pnpm train:data:web` to build a 1000+ sample "Wild-type" dataset.
- [x] **Data Augmentation:** Implement a script to generate "Genetic Variations" of real samples (swapping synonyms, shuffling structural markers).

## Phase 3: Semantic Migration (The Neural Upgrade)
- [x] Implement the selected Semantic Classifier (FastText/FFNN). (Selected: Naive Bayes + Bigrams + Weighted Metadata as a lightweight alternative).
- [x] Integrate into `src/classifier.ts`.
- [x] Verify **<10ms latency** on local hardware. (Result: 0.29ms).

## Phase 4: Validation & Tuning
- [x] Run `pnpm train`.
- [x] Achieve **>90% overall accuracy** in the Genomic Report. (Result: 91.63%).
- [x] Perform a "Live Fire test on un-seen URLs. (Result: 3/4 correct, 1 mislabeled due to extraction limit).

## Phase 5: Documentation & Article Prep
- [x] **Hybrid Classification Logic:** Implement a "Restricted Category Cross-Check" using Naive Bayes to differentiate News from Financial/Legal portals.
- [x] Update `PROGRESS_REPORT.md`.
- [x] Capture "Confusion Matrices" for the planned technical article.
