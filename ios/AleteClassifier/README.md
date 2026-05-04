# AleteClassifier (iOS/macOS)

A high-performance, native Swift implementation of the Alete Content Classifier. This library provides on-device text classification using a distilled **Model2Vec** architecture, optimized for mobile efficiency with SIMD acceleration.

## Features

- **Native Performance**: Built with Swift and optimized with [Surge](https://github.com/Jounce/Surge) for high-performance SIMD-accelerated linear algebra.
- **On-Device Inference**: No network requests required. All classification happens locally for maximum privacy and speed.
- **Model2Vec Architecture**: Uses a lightweight, distilled embedding-based model that punches far above its weight class compared to traditional n-gram models.
- **Cross-Platform Parity**: Rigorously tested for parity with the Alete TypeScript/Node.js implementation.
- **Structural Awareness**: Supports classification weighting using structural metadata (link counts, image counts, etc.) to improve accuracy on web-scraped content.

### Swift Package Manager (SPM)

Add the following to your `Package.swift`:

```swift
dependencies: [
    .package(url: "https://github.com/alete-ai/edge", .branch("main"))
]
```

Or add it via Xcode:
1. File > Add Packages...
2. Enter `https://github.com/alete-ai/edge`
3. Select the `AleteClassifierKit` library.

## Quick Start

### 1. Load Model Assets
The classifier requires four model assets (usually provided in your app bundle):
- `m2v_head.json`: MLP head configuration and weights.
- `m2v_embeddings.bin`: Quantized token embeddings.
- `m2v_quant_meta.json`: Quantization metadata for dequantization.
- `tokenizer.json`: BERT-compatible tokenizer configuration.

```swift
import AleteClassifierKit

// 1. Initialize the Loader
let loader = try ModelLoader(
...
```

    configURL: Bundle.main.url(forResource: "m2v_head", withExtension: "json")!,
    embeddingsURL: Bundle.main.url(forResource: "m2v_embeddings", withExtension: "bin")!,
    metaURL: Bundle.main.url(forResource: "m2v_quant_meta", withExtension: "json")!
)

// 2. Initialize the Tokenizer
let tokenizerData = try Data(contentsOf: Bundle.main.url(forResource: "tokenizer", withExtension: "json")!)
let tokenizerConfig = try JSONDecoder().decode(BertTokenizerConfig.self, from: tokenizerData)
let tokenizer = AleteBertTokenizer(config: tokenizerConfig)

// 3. Create the Classifier
let classifier = try AleteClassifier(modelLoader: loader, tokenizer: tokenizer)
```

### 2. Classify Text

```swift
let text = "Breaking news: New space discovery found on Mars..."
let label = classifier.classify(text: text)

print("Classification: \(label)") // e.g., "News:Science"
```

### 3. Using Structural Metadata
For better accuracy on web content, you can provide structural context:

```swift
let metadata = StructuralMetadata(
    linkCount: 15,
    imageCount: 2,
    buttonCount: 5,
    paragraphCount: 10,
    linkToWordRatio: 0.15
)

let label = classifier.classify(text: text, metadata: metadata)
```

## Comparison: Swift vs. TypeScript

| Feature | Swift (Native) | TypeScript (Web/Edge) |
| :--- | :--- | :--- |
| **Engine** | Model2Vec (Native) | Model2Vec (WASM) + Naive Bayes |
| **Fallback** | N/A (Focus on speed) | Naive Bayes (Statistical Fallback) |
| **Performance** | SIMD-accelerated (Surge) | WASM / JS Optimized |
| **Weighting** | Repeated Metadata Tokens | Repeated Metadata Tokens |
| **Use Case** | iOS/macOS Native Apps | Web Extensions, Server-side, Edge |

**Note on Fallbacks:** The native Swift version focuses on the high-performance `Model2Vec` engine. While the TypeScript version includes a Naive Bayes fallback for "Restricted" categories, the native version relies on the robust AI inference engine which provides higher accuracy across standard categories.

## Performance

On modern iOS hardware (iPhone 12+), classification typically completes in **< 5ms**, making it suitable for real-time content filtering in browser extensions or reader apps.

## License

GNU AGPLv3 - See [LICENSE](../../LICENSE) for details.
