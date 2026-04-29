# AleteClassifier

A high-performance, native Swift implementation of the Model2Vec classification engine, optimized for iOS and macOS.

## Features
- **Ultra-Low Latency:** Inference in <0.2ms on modern Apple Silicon.
- **Hardware Accelerated:** Leverages Apple's Accelerate framework (vDSP and BNNS) for maximum efficiency and low battery impact.
- **Zero Inference Drift:** 100% logic parity with the Alete-Edge JavaScript engine.
- **Memory Efficient:** Uses Int4 quantized embeddings with memory-mapping for near-instant cold start.

## Installation

### Swift Package Manager
Add the following to your `Package.swift`:

```swift
dependencies: [
    .package(url: "https://github.com/alete-ai/edge.git", branch: "ios")
]
```

## Usage

```swift
import AleteClassifier

// 1. Load the model (usually done once at app launch)
let configURL = Bundle.module.url(forResource: "m2v_head", withExtension: "json")!
let embeddingsURL = Bundle.module.url(forResource: "m2v_embeddings", withExtension: "bin")!
let metaURL = Bundle.module.url(forResource: "m2v_quant_meta", withExtension: "json")!
let tokenizerURL = Bundle.module.url(forResource: "tokenizer", withExtension: "json")!

let loader = try ModelLoader(configURL: configURL, embeddingsURL: embeddingsURL, metaURL: metaURL)
let tokenizerData = try Data(contentsOf: tokenizerURL)
let tokenizerConfig = try JSONDecoder().decode(BertTokenizerConfig.self, from: tokenizerData)
let tokenizer = AleteBertTokenizer(config: tokenizerConfig)

let classifier = try AleteClassifier(modelLoader: loader, tokenizer: tokenizer)

// 2. Classify text
let label = classifier.classify(text: "Breaking news from the edge...")
print("Category: \(label)")

// 3. Get detailed probabilities
let probs = classifier.predictProbabilities(text: "Some article text")
```

## Performance
- **Latency:** ~0.15ms per article (iPhone 15 Pro / M2 MacBook Air).
- **Bundle Size:** ~2MB total (including model weights).
- **Architecture:** vDSP for pooling, BNNS for MLP head.

## License
AGPL-3.0
