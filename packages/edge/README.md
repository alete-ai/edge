# @alete-ai/edge

The full-featured Content Extraction & Semantic Classification library. It bundles high-fidelity extraction with a built-in AI engine for genre categorization.

## Features

- **Built-in AI Classification:** Automatically identifies page genre (e.g., News, Finance, Social) using a local 2MB Model2Vec engine.
- **Unified Pipeline:** Orchestrates extraction, classification, and redaction in a single call.
- **Safe-by-Default:** Inherits all sanitization features from `@alete-ai/edge-core`.
- **Zero API Dependency:** Runs entirely on-device for maximum privacy and speed.

## Footprint

| Metric | Value |
|--------|-------|
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
