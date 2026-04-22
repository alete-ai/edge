# Implementation Plan: Model2Vec Semantic Edge Upgrade

## Phase 1: Research & Distillation Setup
- [ ] **Distillation Sandbox:** Setup a Python environment with `model2vec[distill]`.
- [ ] **Base Model Selection:** Benchmark `potion-base-8M` vs `minishlab/m2v-base-glove`.
- [ ] **Distillation Pass:** Generate a 32-dimensional, `int8` quantized model tailored to our 13 categories.
- [ ] **Pure-JS Feasibility:** Verify the math for the Model2Vec "Linear Head" and "Mean Pooling" for pure-JS implementation.

## Phase 2: Implementation (The Neural Upgrade)
- [ ] **Pure-JS Inference Engine:** Create `src/model2vec_engine.ts` with no dependencies.
- [ ] **Tokenizer Sync:** Port the Model2Vec/Sentence-Piece tokenizer logic (or equivalent) to JS.
- [ ] **Weight Integration:** Implement loading for the `.bin` or `.json` distilled weights.
- [ ] **Classifier Migration:** Update `src/classifier.ts` to support the new engine while keeping Naive Bayes as a fallback.

## Phase 3: Genomic Training
- [ ] **Scale Dataset:** Re-run `pnpm train:data:web` to hit 1000+ real samples.
- [ ] **Linear Head Training:** Use the Model2Vec embeddings as a frozen substrate and train the final classification layer.
- [ ] **Genetic Tuning:** Refine weights for Restricted (Health/Financial) vs General (Blog/News).

## Phase 4: Validation & Stability
- [ ] **Genomic Report:** Achieve **>95% overall accuracy**.
- [ ] **Latency Benchmark:** Verify **<10ms** on edge/mobile simulation.
- [ ] **Bundle Audit:** Confirm total package is **<1.5MB**.
- [ ] **Live Fire Test:** Validate against a new battery of unseen URLs.

## Phase 5: Deployment & Mythos
- [ ] Update `PROGRESS_REPORT.md`.
- [ ] Finalize "Beyond FastText" technical article artifacts.
- [ ] Register track as [x] Completed.
