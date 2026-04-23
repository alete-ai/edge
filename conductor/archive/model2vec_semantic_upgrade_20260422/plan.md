# Implementation Plan: Model2Vec Semantic Edge Upgrade

## Phase 1: Research & Distillation Setup
- [x] **Distillation Sandbox:** Setup a Python environment with `model2vec[distill]`.
- [x] **Base Model Selection:** Benchmark `potion-base-8M` vs `minishlab/m2v-base-glove`.
- [x] **Distillation Pass:** Generate a 32-dimensional, `int8` quantized model tailored to our 13 categories.
- [x] **Pure-JS Feasibility:** Verify the math for the Model2Vec "Linear Head" and "Mean Pooling" for pure-JS implementation.

## Phase 2: Implementation (The Neural Upgrade)
- [x] **Engine Selection:** Install and benchmark `@yarflam/potion-base-8m` (WASM-based).
- [x] **WASM Integration:** Implement `src/model2vec_engine.ts` using the WASM backend.
- [x] **Weight Integration:** Implement loading for the distilled weights into the WASM engine.
- [x] **Classifier Migration:** Update `src/classifier.ts` to support the new engine while keeping Naive Bayes as a fallback.

## Phase 3: Genomic Training
- [x] **Scale Dataset:** Re-run `pnpm train:data:web` to hit 1000+ real samples.
- [x] **Linear Head Training:** Use the Model2Vec embeddings as a frozen substrate and train the final classification layer.
- [x] **Genetic Tuning:** Refine weights for Restricted (Health/Financial) vs General (Blog/News).

## Phase 4: Validation & Stability
- [x] **Genomic Report:** Achieve **>95% overall accuracy**.
- [x] **Latency Benchmark:** Verify **<10ms** on edge/mobile simulation.
- [x] **Bundle Audit:** Confirm total package is **<1.5MB**.
- [x] **Live Fire Test:** Validate against a new battery of unseen URLs.

## Phase 5: Deployment & Mythos
- [x] Update `PROGRESS_REPORT.md`.
- [x] Finalize "Beyond FastText" technical article artifacts.
- [x] Register track as [x] Completed.
