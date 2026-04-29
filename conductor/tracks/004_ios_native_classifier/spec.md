# Specification: iOS Native Classifier

## 1. Functional Requirements

### 1.1 Model Parity
- Load the same weights (JSON/BIN) as the JS implementation.
- Support dequantization of Int4 embeddings matching the JS `Model2VecEngine` logic.
- Implement Weighted Mean Pooling using the same `zipf_weights`.
- Implement L2 Normalization and 2-layer MLP head.

### 1.2 Tokenization Parity
- Port the `BertTokenizer` logic from `platform/tokenizer.ts` to Swift.
- Match normalization (cleaning, whitespace, Chinese chars, casing, accent stripping).
- Match WordPiece encoding logic exactly.

### 1.3 Preprocessing Parity
- Implement the "ContentClassifier" preprocessing (stopword filtering, stemming, bigrams).
- Use Apple's `NaturalLanguage` framework ONLY for stemming, ensuring it matches `wink-nlp` behavior or provide a custom stemmer if needed.
- Support structural metadata tokens (`__btn_high`, etc.).

## 2. Technical Architecture

### 2.1 Inference Engine
- **Embedding Lookup:** Use `vDSP_vgath` or direct indexing for gathering embeddings.
- **Weighted Mean:** Use `vDSP_vsmul` and `vDSP_vadd`.
- **L2 Norm:** Use `vDSP_svesq` and `vDSP_vsdiv`.
- **MLP Head:** Use `vDSP_mmul` (matrix multiplication) for the weights and `vDSP_vadd` for bias. ReLU implementation via `vDSP_vthres`.

### 2.2 Memory Management
- Utilize `Data(contentsOf:options: .mappedIfSafe)` to memory-map large binary weights.
- Minimize allocations during inference by reusing buffers.

## 3. Verification Strategy
- **Unit Tests:** Verify individual components (Tokenizer, Dequantizer, MLP).
- **Parity Tests:** A dedicated test target that consumes a JSON file of `(text, expected_probs)` generated from the JS implementation.
- **Benchmark Tests:** Measure latency and memory footprint on physical devices.
