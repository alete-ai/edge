# AleteEdge: HTML Extraction & Semantic Classification Library

AleteEdge is a standalone TypeScript library designed for fast, on-device content extraction and semantic categorization. Unlike cloud-heavy solutions like **Firecrawl** or **Crawl4AI** that rely on expensive LLM API calls and bulky headless browsers, AleteEdge moves intelligence directly to the edge—transforming raw HTML into clean, semantic Markdown using a **built-in, 2MB AI engine** that identifies page intent without calling an API.

## Features

- **High-Fidelity Markdown Transforms:** Specialized extraction mode that produces clean, article-like Markdown optimized for LLM ingestion.
- **Secure Content Buckets:** Automatic PII and Credential redaction, ensuring user data is private and "safe-by-default."
- **Self-Contained AI:** No external APIs, ONNX runtimes, or heavy dependencies. The intelligence is bundled and runs instantly in any JS environment.
- **Zero-Headless Architecture:** Full extraction and categorization without Playwright, Puppeteer, or Docker.
- **Elite Performance:** 96.14% accuracy with <5ms execution latency and a total package size of just 2.6MB.

## Installation

```bash
pnpm add @alete-ai/edge
```

## Quick Start

AleteEdge is designed to "just work." It automatically resolves its internal assets across Node.js, Browsers, and WebExtensions.

```typescript
import { AleteEdge } from '@alete-ai/edge';

const edge = new AleteEdge();

const html = '<html>...</html>';

/**
 * End-to-end processing:
 * 1. Extracts structural markers for categorization.
 * 2. Runs built-in AI inference.
 * 3. Extracts clean semantic Markdown.
 * 4. Redacts PII/Credentials.
 * 
 *    Information. Refined.
 */
const { markdown, label, timing } = await edge.process(html);

console.log(`Detected Genre: ${label}`);     // e.g., 'Informational:News'
console.log(`Total Time: ${timing.total.toFixed(2)}ms`);
console.log(`Clean Content: ${markdown}`);
```

For a full demonstration of this library integrated into a WebExtension, see the **[Alete Chrome Extension](https://github.com/alete-ai/chrome-extension)**.

## AI Autoload & Environment Support

The library handles all asset resolution internally using a specialized autoload strategy:

- **Node.js:** Automatically resolves and reads model assets from the filesystem.
- **Browsers:** Fetches optimized assets on-demand from your server or CDN.
- **Extensions:** Verified for Chrome MV3 (Service Workers) and Safari/iOS Extensions using native platform resolution (`chrome.runtime.getURL`).

### Performance & Footprint

| Metric | Value |
|--------|-------|
| **Categorization Accuracy** | 96.14% (Int4 Standard) |
| **Total Bundle Size (NPM)** | ~2.6 MB |
| **AI Model Mass** | ~1.8 MB |
| **Inference Latency** | <5ms (avg) |
| **Memory Overhead** | Minimal (On-demand initialization) |

## Architecture

### 1. Multi-Pass Extraction (`Extractor`)
- **STRUCTURAL Mode:** Preserves UI markers (buttons, links, labels) to provide high-resolution data for the classifier.
- **SEMANTIC Mode:** Produces clean, article-like Markdown optimized for LLMs.

### 2. Semantic Categorization (`Model2VecEngine`)
Powered by a distilled **Int4-quantized** architecture.
- **Zero-Dependency:** No ONNX, TensorFlow, or Wasm required. Pure-JS bit-unpacking and forward pass.
- **Hybrid Fallback:** Seamlessly degrades to a statistical engine if signals are insufficient.

## License

AGPL-3.0 - Copyright (c) 2026 [Alete Inc.](https://alete.ai/) <https://github.com/alete-ai>
