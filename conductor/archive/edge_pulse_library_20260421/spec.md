# Specification: EdgePulse Library

## Overview
Create `edge-pulse`, a standalone TypeScript library (root level) that acts as the "Neural Interface" to the DOM. It extracts the existing HTML ingestion pipeline (`linkedom` + `dom-to-semantic-markdown`) and introduces a fast, edge-based classification layer (`Wink NLP`). It is licensed under AGPL-3.0 and designed to be easily spun out into its own repository.

## Clear-Team Synthesis & Persona Value

### The Strategic Crucible
- **Julian (Vision):** AGPL-3.0 enforces a strong sovereign boundary. It opens the "Sovereign Scribe" to the world while protecting Alete's intellectual property model.
- **Maya (Metabolism):** Strict architectural boundaries required. `edge-pulse` must have **zero dependencies** on other internal `@vedai` packages. The NPM package must exclude the Python training data to maintain metabolic efficiency (low bundle size).
- **Serra (Substrate):** The directory structure clearly separates the JS runtime (`src/`) from the model training pipeline (`training/`). We use Python to fetch/clean multi-source substrates (X-GENRE, Financial signals), and a JS script to train the Wink NLP model.
- **Aris (Phenotype):** The library's `README.md` leverages the "Soil" (`linkedom`) and "Botanist" (`dom-to-semantic-markdown`) metaphors to create a high-status developer phenotype.
- **Lyra (Mythos):** This library is the edge sword that cuts through the "Blue Glare" of the modern web.

### Persona TTV (Time To Value)
- **The Alpha-Curator (Elena):** Gets a high-fidelity Markdown extraction with an instant semantic label ("News", "Blog", etc.) ensuring her intelligence pipeline is noise-free.
- **The Optimizer (Marcus):** Appreciates the ultra-low metabolic cost (Wink NLP < 50ms) compared to running heavy LLMs in the browser.
- **The Digital Ascetic (David):** Open-source AGPL transparency ensures he can trust the tool isn't secretly phoning home.

## Architecture

### 1. The Substrate: `linkedom`
- **Role:** DOM Simulation Environment (The "Soil").
- **Function:** Parses raw HTML strings into a traversable DOM tree, crucial for Service Worker and Node.js environments lacking a native `window`.

### 2. The Logic: `dom-to-semantic-markdown`
- **Role:** Content Transformation (The "Botanist").
- **Function:** Converts the DOM tree into Markdown with semantic awareness, discarding navigational noise and extracting the core signal.

### 3. The Pulse: `wink-nlp`
- **Role:** Fast Hierarchical Semantic Bucketing.
- **Function:** Classifies the extracted Markdown into a hierarchical taxonomy.
- **Taxonomy (The Pulse Waves):**
    - `Informational` (Sub: News, Research, Blog)
    - `Educational` (Sub: Instruction, Tutorial, Guide)
    - `Commercial` (Sub: Promotion, Advertisement)
    - `Social` (Sub: Forum, Chat)
    - `Creative` (Sub: Prose, Lyrical)
    - `Functional` (Sub: App, Settings, Account)
    - `Restricted` (Sub: Financial, Health, PII)

### 4. The Training Pipeline
- **Location:** `training/`
- **Function:** 
    - **Substrate A:** `X-GENRE` (HuggingFace) for core genres.
    - **Substrate B:** `US Bank Transactions` (HuggingFace) for financial signal reinforcement.
    - **Substrate C (Synthetic):** Custom generation of common UI strings and PII-heavy page patterns (Bank dashboards, Health portals) to ensure high "Restricted" signal detection.

## Core Directives
1. Initialize standard TS package structure in the root.
2. Add AGPL-3.0 `LICENSE`.
3. Set up a multi-source training environment (X-GENRE + Financial + Synthetic Data).
4. Implement hierarchical classification (`Group:Category`).
5. Ensure the "Restricted" bucket has high recall for common financial and medical signatures.
