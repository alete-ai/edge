# AleteEdge: HTML Extraction & Semantic Classification Library

AleteEdge is a standalone TypeScript and Swift library designed for fast, on-device content extraction and semantic categorization. Unlike cloud-heavy solutions like **Firecrawl** or **Crawl4AI** that rely on expensive LLM API calls and bulky headless browsers, AleteEdge moves intelligence directly to the edge—transforming raw HTML into clean, semantic Markdown using a **built-in, 2MB AI engine** that identifies page intent without calling an API.

## Features

- **High-Fidelity Markdown Transforms:** Specialized extraction mode that produces clean, article-like Markdown optimized for LLM ingestion.
- **Secure Content Buckets:** Automatic PII and Credential redaction, ensuring user data is private and "safe-by-default."
- **Self-Contained AI:** No external APIs or heavy dependencies. The intelligence is bundled and runs instantly in any JS environment.
- **Native Mobile Core:** High-performance Swift implementation for iOS and macOS with SIMD acceleration.
- **Platform Agnostic Engine:** Native support for Node.js, modern Browsers (zero polyfills), and WebExtensions (MV3).
- **Elite Performance:** 96.14% accuracy with <5ms execution latency and a total package size of just 2.6MB (unpacked).

## Installation

This repository is organized as a monorepo containing multiple platforms:

### TypeScript (Node.js, Browsers, Extensions)

```bash
# For the full AI-powered suite
pnpm add @alete-ai/edge

# For just the lightweight extraction core
pnpm add @alete-ai/edge-core
```

### Swift (iOS, macOS)

Add AleteEdge as a dependency in your `Package.swift`:

```swift
dependencies: [
    .package(url: "https://github.com/alete-ai/edge", .branch("main"))
]
```

## Quick Start (Full Package)

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
 */
const { markdown, label, timing } = await edge.process(html);

console.log(`Detected Genre: ${label}`);     // e.g., 'Informational:News'
console.log(`Total Time: ${timing.total.toFixed(2)}ms`);
console.log(`Clean Content: ${markdown}`);
```

## Browser Support (One-Click Install)

The library includes a dedicated browser build that leverages native APIs (like `DOMParser`) instead of Node.js polyfills, providing a frictionless setup for frontend projects.

### Direct Script Import
```html
<script type="module">
  import { AleteEdge } from './node_modules/@alete-ai/edge/dist/index.browser.js';
  
  // Browsers require an explicit path to the model weights if not at the default root
  const edge = new AleteEdge({ modelPath: './node_modules/@alete-ai/edge/dist/model/' });
  const result = await edge.process(document.documentElement.outerHTML);
</script>
```

## AI Autoload & Environment Support

The library handles all asset resolution internally using a specialized platform bridge:

- **Node.js:** Automatically resolves and reads model assets from the filesystem using `fs`.
- **Browsers:** Fetches optimized assets on-demand from your server or CDN.
- **Extensions:** Verified for Chrome MV3 (Service Workers) and Safari/iOS Extensions using native platform resolution (`chrome.runtime.getURL`).
- **Native (iOS/macOS):** High-performance Swift implementation with SIMD acceleration (see [ios/AleteClassifier](ios/AleteClassifier/README.md)).

### Performance & Footprint

| Metric | Value |
|--------|-------|
| **Categorization Accuracy** | 96.14% (Int4 Standard) |
| **Total Bundle Size (NPM)** | ~3.5 MB (Tarball) |
| **AI Model Mass** | ~1.8 MB |
| **Inference Latency** | <5ms (avg) |
| **Memory Overhead** | Minimal (On-demand initialization) |

## Architecture

### 1. Platform-Agnostic Extractor
Utilizes a **DOM Bridge** that automatically switches between `linkedom` in Node.js and the native `DOMParser` in browsers.
- **STRUCTURAL Mode:** Preserves UI markers (buttons, links, labels) to provide high-resolution data for the classifier.
- **SEMANTIC Mode:** Produces clean, article-like Markdown optimized for LLMs.

### 2. Semantic Categorization (`Model2VecEngine`)
Powered by a distilled **Int4-quantized** architecture with zero native dependencies.
- **Pure-JS Inference:** Forward pass logic implemented in vanilla TypeScript.
- **Hybrid Fallback:** Seamlessly degrades to a statistical engine if input data is insufficient.

## License

AGPL-3.0 - Copyright (c) 2026 [Alete Inc.](https://alete.ai/) <https://github.com/StoyanD>
