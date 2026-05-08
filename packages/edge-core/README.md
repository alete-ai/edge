# @alete-ai/edge-core

The lightweight, platform-agnostic core of Alete Edge. It focuses on high-fidelity HTML extraction and data sanitization without the overhead of AI models.

## Why Use Core?

- **Zero AI Overhead:** Ideal if you only need content extraction or if you are providing structural data to a native classifier (e.g., Swift on iOS/Mac).
- **Lightweight:** Minimal bundle size and memory footprint.
- **Cross-Platform:** Runs seamlessly in Node.js, Browsers, and WebExtensions.
- **Native Integration:** Designed to feed the [Alete Native Swift Classifier](../../ios/AleteClassifier/README.md) with standardized structural metadata.

## Footprint

| Metric | Value |
|--------|-------|
| **Tarball Size** | ~45 kB |
| **Unpacked Size** | ~132 kB |

## Installation

```bash
pnpm add @alete-ai/edge-core
```

## Usage

### 1. High-Fidelity Extraction
Extract clean Markdown optimized for LLMs or reading.

```typescript
import { Extractor, ExtractMode } from '@alete-ai/edge-core';

const extractor = new Extractor();
const html = '<html><body><h1>Hello</h1><p>World</p></body></html>';

// SEMANTIC Mode (default): Clean, article-like output
const markdown = await extractor.extract(html, ExtractMode.SEMANTIC);
```

### 2. Structural Data Generation
Extract structural markers (buttons, links, counts) to feed into a classifier.

```typescript
import { Extractor, ExtractMode } from '@alete-ai/edge-core';

const extractor = new Extractor();
const { markdown, metadata } = await extractor.extractWithMetadata(html, ExtractMode.STRUCTURAL);

console.log(metadata); 
// { buttonCount: 5, linkCount: 12, wordCount: 450, ... }

console.log(markdown);
// Includes structural markers like [Click Me] for better classification.
```

### 3. Data Sanitization (Redaction)
Protect user privacy by redacting PII, credentials, and infrastructure details.

```typescript
import { Redactor } from '@alete-ai/edge-core';

const redactor = new Redactor();
const safeMarkdown = redactor.redact('My email is test@example.com');
// "My email is [EMAIL_REDACTED]"
```

## Architecture

- **DOM Bridge:** Automatically switches between `linkedom` (Node.js) and native `DOMParser` (Browser).
- **Semantic Markdown:** Built on `mdream` for high-fidelity, LLM-optimized output with native frontmatter support.
- **Structural Metadata:** Real-time calculation of page density and UI complexity.

## License

AGPL-3.0 - Copyright (c) 2026 [Alete Inc.](https://alete.ai/)
