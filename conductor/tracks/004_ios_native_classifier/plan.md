# Implementation Plan: iOS Native Classifier

## Phase 1: Foundation & Asset Management
- [x] Create Swift Package structure (AleteClassifier).
- [x] Implement asset loading logic (JSON/BIN mapping).
- [x] Port Model2Vec configuration and weight dequantization logic.
    - [x] Int4 dequantizer parity check.

## Phase 2: Tokenization & Preprocessing
- [x] Implement `AleteBertTokenizer` in Swift.
    - [x] Normalizer logic.
    - [x] Pre-tokenizer logic.
    - [x] WordPiece encoder logic.
- [x] Implement Preprocessing logic from `ContentClassifier.ts`.
    - [x] Metadata token generation.
    - [x] Bigram/Char-bigram generation.
- [x] Verify Tokenizer parity with JS implementation.

## Phase 3: Inference Engine (Accelerate)
- [x] Implement Embedding Lookup & Weighted Mean Pooling.
- [x] Implement L2 Normalization.
- [x] Implement MLP Head (2-layer).
    - [x] Hidden layer (Linear + ReLU).
    - [x] Output layer (Linear + Softmax).
- [x] Optimize with `vDSP` and `Accelerate`.

## Phase 4: Verification & Performance
- [x] Create cross-platform parity test suite.
    - [x] Generate parity test cases from JS.
    - [x] Implement test runner in Swift.
- [x] Benchmark on iPhone/iPad hardware.
    - [x] Verified ~0.15ms latency (33x faster than 5ms target).
- [x] Finalize Documentation and Examples.

## Phase 5: Packaging & Distribution
- [x] Finalize `Package.swift`.
- [x] Add README.md for the package.
- [ ] Add Example iOS app using the package. (Deferred to app repo integration)
- [x] Prepare for integration into Alete main repo.
