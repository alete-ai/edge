# Implementation Plan: iOS Native Classifier

## Phase 1: Foundation & Asset Management
- [ ] Create Swift Package structure (AleteClassifier).
- [ ] Implement asset loading logic (JSON/BIN mapping).
- [ ] Port Model2Vec configuration and weight dequantization logic.
    - [ ] Int4 dequantizer parity check.

## Phase 2: Tokenization & Preprocessing
- [ ] Implement `AleteBertTokenizer` in Swift.
    - [ ] Normalizer logic.
    - [ ] Pre-tokenizer logic.
    - [ ] WordPiece encoder logic.
- [ ] Implement Preprocessing logic from `ContentClassifier.ts`.
    - [ ] Metadata token generation.
    - [ ] Bigram/Char-bigram generation.
- [ ] Verify Tokenizer parity with JS implementation.

## Phase 3: Inference Engine (Accelerate)
- [ ] Implement Embedding Lookup & Weighted Mean Pooling.
- [ ] Implement L2 Normalization.
- [ ] Implement MLP Head (2-layer).
    - [ ] Hidden layer (Linear + ReLU).
    - [ ] Output layer (Linear + Softmax).
- [ ] Optimize with `vDSP` and `Accelerate`.

## Phase 4: Verification & Performance
- [ ] Create cross-platform parity test suite.
    - [ ] Generate 1000+ test cases from JS.
    - [ ] Implement test runner in Swift.
- [ ] Benchmark on iPhone/iPad hardware.
- [ ] Finalize Documentation and Examples.

## Phase 5: Packaging & Distribution
- [ ] Finalize `Package.swift`.
- [ ] Add Example iOS app using the package.
- [ ] Prepare for integration into Alete main repo.
