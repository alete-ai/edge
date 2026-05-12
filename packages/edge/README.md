# @alete-ai/edge

The full-featured Content Extraction & Semantic Classification library. It bundles high-fidelity extraction with a built-in AI engine for genre categorization.

## Why Alete Edge?

Alete Edge is designed to solve the "Context Inflation" problem in LLM-powered applications. By classifying and filtering content **before** it leaves the user's device, you can:

- **Save 90%+ on Token Costs:** Identify low-value pages (e.g., General, Promotion) and prevent them from being sent to expensive cloud models like GPT-4 or Claude 3.5.
- **Privacy First:** Classify sensitive content (PII, Financial, Health) locally to ensure it is redacted or handled according to policy before transmission.
- **Instant Decisioning:** Make routing decisions in < 50ms without waiting for a round-trip to an inference API.

## Features

- **Built-in AI Classification:** Automatically identifies page genre using a local 2MB Model2Vec engine.
- **Classification Categories:** Supports 13 specialized labels including:
  - `Informational:News`, `Informational:Blog`, `Informational:Research`
  - `Commercial:Promotion`, `Social:Forum`, `Educational:Instruction`
  - `Restricted:Financial`, `Restricted:Health`, `Restricted:Legal`, `Restricted:PII`
  - `Functional:App`, `Creative:Prose`, `Other:General`
- **Unified Pipeline:** Orchestrates extraction, classification, and redaction in a single call.
- **Safe-by-Default:** Inherits all sanitization features from `@alete-ai/edge-core`.
- **Zero API Dependency:** Runs entirely on-device for maximum privacy and speed.
- **Cross-Platform Parity:** Rigorously matched with the native Swift implementation for iOS/macOS.

## Footprint
...
```

## Cross-Platform Support

This package is part of the AleteEdge ecosystem. If you are building native Apple applications, we recommend using the native Swift implementation:

- **Swift (iOS/macOS):** [AleteClassifierKit](../../ios/AleteClassifier/README.md) - Optimized with SIMD (Accelerate) for peak mobile performance.

## Relationship to Edge-Core

| **Tarball Size** | ~5.7 MB |
| **Unpacked Size** | ~13.7 MB |
| **AI Model Mass** | ~1.8 MB (Int4) |

## Installation

```bash
pnpm add @alete-ai/edge
```

## Quick Start

```typescript
import { AleteEdge } from '@alete-ai/edge';

const edge = new AleteEdge();
const html = '<html>...</html>';

const { markdown, label, timing } = await edge.process(html);

console.log(`Detected Genre: ${label}`);
console.log(`Content: ${markdown}`);
```

## Relationship to Edge-Core

This package depends on `@alete-ai/edge-core`. If you only need HTML-to-Markdown extraction or are using a native (non-JS) classifier, consider using the lightweight core package instead.

## License

AGPL-3.0 - Copyright (c) 2026 [Alete Inc.](https://alete.ai/)
