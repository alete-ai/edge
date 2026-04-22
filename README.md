# EdgePulse: Neural Extraction & Semantic Bucketing Library

EdgePulse is a standalone TypeScript library designed for fast, on-device content extraction and semantic classification. It transforms raw HTML into clean, semantic Markdown and categorizes it into high-level intent buckets.

## Architecture

EdgePulse consists of three primary functional layers:

### 1. DOM Simulation: `linkedom`
Raw HTML is processed through `linkedom` to provide a lightweight, high-performance DOM simulation environment. This enables safe parsing and traversal of content in environments like Service Workers or Node.js where a native `window` object is unavailable.

### 2. Content Extraction: `dom-to-semantic-markdown`
Extraction involves identifying the core content within the HTML. The library parses the DOM tree, removes navigational elements and boilerplate, and identifies semantic structures to produce high-fidelity Markdown.

### 3. Semantic Classification: `wink-nlp`
Once extracted, content is classified using ultra-fast Naive Bayes classification (Wink NLP). The library buckets content into a hierarchical taxonomy (e.g., `Restricted:Financial`, `Educational:Instruction`) in under 50ms.

### 4. Privacy-First Data Sanitization: `Redactor`
EdgePulse includes a **default-on** sanitization layer to intercept extracted markdown and "scrub" it for sensitive "Signal Leakage" (PII, credentials, financial data) before ingestion. This ensures "Cognitive Sovereignty" and compliance by removing high-risk data at the source.

- **Privacy by Design:** Enabled by default. No sensitive metadata persists in the data substrate unless explicitly allowed.
- **High-Recall Patterns:** Detection of Emails, Phone Numbers, SSNs, Credit Cards, IBANs, API Keys (AWS, OpenAI, etc.), and JWTs.
- **Informative Placeholders:** Redacted data is replaced with descriptive placeholders (e.g., `[EMAIL_REDACTED]`) to maintain LLM context while ensuring security.
- **Configurable:** Selectively enable/disable categories, provide custom placeholders, or opt-out entirely.

## Features

- **Edge-First:** Optimized for Service Workers, Chrome Extensions, and edge functions.
- **Zero-Dependency Core:** Designed for high performance and low bundle size.
- **Hierarchical Classification:** Refined bucketing for automated content organization.
- **Privacy-First:** High-performance sanitization layer enabled by default to prevent sensitive data leakage.
- **AGPL-3.0 Licensed:** Ensuring the open-source integrity of the toolset.

## Usage

```typescript
import { EdgePulse } from 'edge-pulse';

// By default, sanitization is enabled for maximum privacy.
const pulse = new EdgePulse();

// To opt-out for maximum metabolic efficiency (not recommended):
const fastPulse = new EdgePulse({
  redactor: false
});

// For custom configurations:
const customPulse = new EdgePulse({
  redactor: {
    redactFinancials: true,
    redactCredentials: true,
    customPlaceholders: {
      EMAIL: '[HIDDEN_CONTACT]'
    }
  }
});

const html = '<html>...</html>';
const { markdown, label, metadata } = await pulse.process(html);

console.log(`Label: ${label}`); // e.g. "Informational:News"
console.log(`Clean Markdown: ${markdown}`);
```

## The Training Pipeline

To update the classification model:

1. **Install Python Dependencies:**
   ```bash
   cd training
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Fetch Data:**
   ```bash
   python fetch_dataset.py
   python generate_synthetic.py
   ```

3. **Generate Model Weights:**
   ```bash
   node training/train_model.js
   ```

## Development

```bash
pnpm install
pnpm test
```

## License

AGPL-3.0 - Copyright (c) 2026 [Alete Inc.](https://alete.ai/) <https://github.com/alete-ai>
