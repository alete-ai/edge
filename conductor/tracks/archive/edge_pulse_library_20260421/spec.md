# Specification: AleteEdge Library

## Overview
Create `AleteEdge`, a standalone TypeScript library (root level) that provides a lightweight DOM interface. It extracts the existing HTML ingestion pipeline (`linkedom` + `dom-to-semantic-markdown`) and introduces a fast, edge-based classification layer (`Wink NLP`). It is licensed under AGPL-3.0 and designed to be easily spun out into its own repository.

## Clear-Team Synthesis & Persona Value

### The Strategic Crucible
- **Julian (Vision):** AGPL-3.0 enforces a strong boundary. It opens the library to the world while protecting the core intellectual property model.
- **Maya (Efficiency):** Strict architectural boundaries required. `AleteEdge` must have **zero dependencies** on other internal packages. The NPM package must exclude the training data to maintain high efficiency (low bundle size).
- **Serra (Architecture):** The directory structure clearly separates the JS runtime (`src/`) from the model training pipeline (`training/`). We use Python to fetch and clean multi-source datasets, and a JS script to train the classification model.
- **Aris (Interface):** The library's documentation focuses on clarity and simplicity to ensure a professional developer experience.
- **Lyra (Narrative):** This library is the foundation for high-fidelity data processing on the edge.

### Persona TTV (Time To Value)
- **The Alpha-Curator (Elena):** Gets a high-fidelity Markdown extraction with an instant semantic label ("News", "Blog", etc.) ensuring her information pipeline is noise-free.
- **The Optimizer (Marcus):** Appreciates the ultra-low latency (Wink NLP < 50ms) compared to running heavy LLMs in the browser.
- **The Digital Ascetic (David):** Open-source AGPL transparency ensures he can trust the tool's data handling.

## Architecture

### 1. DOM Simulation: `linkedom`
- **Role:** Lightweight DOM Environment.
- **Function:** Parses raw HTML strings into a traversable DOM tree, crucial for Service Worker and Node.js environments lacking a native `window`.

### 2. Content Transformation: `dom-to-semantic-markdown`
- **Role:** Markdown Generation.
- **Function:** Converts the DOM tree into Markdown with semantic awareness, discarding navigational noise and extracting the core content.

### 3. Classification: `wink-nlp`
- **Role:** Fast Hierarchical Semantic Categorization.
- **Function:** Classifies the extracted Markdown into a hierarchical taxonomy.
- **Taxonomy:**
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
    - **Dataset A:** `X-GENRE` (HuggingFace) for core genres.
    - **Dataset B:** `US Bank Transactions` (HuggingFace) for financial detection reinforcement.
    - **Dataset C (Synthetic):** Custom generation of common UI strings and patterns to ensure high detection of sensitive information.

## Core Directives
1. Initialize standard TS package structure in the root.
2. Add AGPL-3.0 `LICENSE`.
3. Set up a multi-source training environment.
4. Implement hierarchical classification (`Group:Category`).
5. Ensure high recall for common financial and medical signatures.
