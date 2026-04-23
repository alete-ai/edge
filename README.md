# AleteEdge: HTML Extraction & Semantic Classification Library

AleteEdge is a standalone TypeScript library designed for fast, on-device content extraction and semantic classification. It transforms raw HTML into clean, semantic Markdown and categorizes it into high-level intent categories using a distilled "Neural-First" architecture.

## Features

- **Neural-First:** Migration to **Model2Vec** embeddings for >90% semantic accuracy.
- **Edge-Optimized:** Zero native dependencies; 100% compatible with Chrome Extensions (MV3), Safari Desktop, and iOS Mobile Extensions.
- **Multi-Pass Extraction:** Dedicated `SIGNAL` and `SEMANTIC` modes to balance classification accuracy with clean output.
- **On-Device Privacy:** Default-on PII/Credential redaction layer.
- **High-Resolution Metrics:** Internal phase-level benchmarking (Extraction, Classification, Redaction).
- **Lightweight Substrate:** Total runtime footprint <1.5MB.

## Installation

```bash
pnpm add @alete-ai/edge
# or
npm install @alete-ai/edge
```

## Quick Start

```typescript
import { AleteEdge } from '@alete-ai/edge';

const edge = new AleteEdge();

const html = '<html>...</html>';

// End-to-end processing (Extraction + Classification + Sanitization)
const { markdown, label, timing, metadata } = await edge.process(html);

console.log(`Detected Genre: ${label}`);
console.log(`Total Time: ${timing.total.toFixed(2)}ms`);
console.log(`Clean Content: ${markdown}`);
```

## Architecture

### 1. Multi-Pass Extraction (`Extractor`)
- **SIGNAL Mode:** Preserves UI markers (buttons, links, labels) to provide high-resolution signals for the classifier.
- **SEMANTIC Mode:** Leverages Mozilla Readability to produce clean, article-like Markdown optimized for LLMs.

### 2. Neural Classification (`Model2VecEngine`)
AleteEdge uses a distilled **128-dimensional Model2Vec** model with a 2-layer MLP head.
- **Zero-Dependency Inference:** Pure-JS implementation of weighted mean pooling and MLP forward pass.
- **Fallback:** Seamlessly degrades to a lightweight Naive Bayes engine if the neural engine fails.

### 3. Data Sanitization (`Redactor`)
Intercepts and scrubs PII (Emails, API Keys, Financials) by default.
```typescript
const edge = new AleteEdge({
  redactor: {
    redactFinancials: true,
    customPlaceholders: { EMAIL: '[HIDDEN_CONTACT]' }
  }
});
```

## Environment Support

- **Browser/Worker:** 100% support for Chrome, Firefox, and Safari.
- **Extensions:** Verified on Chrome MV3 Service Workers and Safari iOS Extensions.
- **Node.js:** Supports v18+ with standard ESM.

## Benchmarking & Performance

The `process()` method returns granular timing data:
- `extraction_signal`: DOM parsing and marker capture.
- `classification`: Neural inference time (typically <2ms).
- `extraction_semantic`: Clean content generation.
- `redaction`: Sanitization latency.

## Training the Model

To retrain the underlying semantic embeddings or classification head:

1. **Setup Pipeline:**
   ```bash
   pnpm install
   cd training && python3 -m venv venv && source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Execute Train:**
   ```bash
   pnpm train
   ```
   This unified command runs synthetic data generation, real-world ingestion (from `urls.json`), and weight optimization, outputting a timestamped report in `training/reports/`.

## License

AGPL-3.0 - Copyright (c) 2026 [Alete Inc.](https://alete.ai/) <https://github.com/alete-ai>
