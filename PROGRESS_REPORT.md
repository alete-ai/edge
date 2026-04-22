# Alete-Edge: Evolution & Progress Report

This document tracks the strategic evolution, architectural changes, and training milestones of the Alete-Edge library. It serves as the primary substrate for technical articles and project documentation.

## Track Archive: Summary of Milestones

### 1. Classifier Precision Upgrade (v2) - April 22, 2026
**Status:** In-Progress / Pivoting to Semantic Migration
- **Problem:** Brittle Naive Bayes classification mislabeled Login pages as "Instruction" and News lists as "Research."
- **Root Cause:** Single-pass extraction using Mozilla Readability was stripping critical UI markers ("Signal Blindness").
- **Solution:** 
    - Implemented a **Multi-Pass Extraction Pipeline** (SIGNAL vs SEMANTIC modes).
    - SIGNAL mode bypasses Readability and preserves bracketed UI markers (e.g., `[Login]`, `[Submit]`).
    - SEMANTIC mode provides high-fidelity, clean Markdown for LLMs.
- **Results:** Correctly classified LangSmith Dashboards and complex News lists.

### 2. Real-World Data Ingestion - April 22, 2026
**Status:** Ongoing
- **Initiative:** Moving from "Lab-grown" synthetic data to "Wild-type" real-world web DNA.
- **Implementation:** 
    - Created `training/ingest_web.ts` and `training/urls.json`.
    - Curated a global registry of 260 URLs across News, App, Health, and Finance.
    - Successfully ingested 69 high-signal samples to boost training substrate.
- **Performance Impact:** Overall accuracy increased from **67.9% to 76.9%** in a single cycle.

### 3. Reproducible Training Pipeline - April 22, 2026
**Status:** Completed
- **Substrate Stability:** Unified all training steps into a single command: `pnpm train`.
- **Auditable Reporting:** 
    - Implemented "Genomic Reports" in `training/reports/`.
    - Every run now outputs a timestamped JSON with source breakdowns (Synthetic vs X-Genre vs Real Web) and per-label accuracy percentages.
    - Verified perfect 100% accuracy for `Functional:App` and `Restricted:Financial` following the SIGNAL mode implementation.

### 4. Classifier Precision Optimization (v3) - April 22, 2026
**Status:** In-Progress (88% Achievement)
- **Problem:** Weak "General Web" precision (Blogs, Forums, Research).
- **Solution:** 
    - **Structural Signal Ingestion:** Modified `Extractor.ts` to output `SignalMetadata` (button counts, link density, paragraph ratios).
    - **Neural Upgrade (Naive Bayes+):** Implemented Bigrams and Character Bigrams to capture local semantic context.
    - **Weighted Metadata:** Repetitive token weighting (5x) for structural markers to increase their "Signal Mass" in the Naive Bayes engine.
    - **Massive Data Expansion:** Scaled the training set from 4k to **10.7k samples** using automated augmentation and a global registry of 400+ URLs.
- **Results:** 
    - **Overall Accuracy:** Increased from **76.9% to 91.63%**.
    - **Blog Precision:** Jumped from 30% to **93.29%**.
    - **Forum Precision:** Jumped from 0% to **85.83%**.
    - **Live Fire Test:** Successfully identified `calnewport.com` (Blog), `github.com/login` (App), and `chase.com` (Financial) on un-seen live data.
    - **Latency:** Verified at **0.29ms** (far below the 10ms threshold).
    - **Bundle Size:** Optimized at **1.3MB** (Runtime) / **1.5MB** (Weights) using Token Frequency Pruning (MAX_TOKENS=20000).

---

## Architectural Evolution

### Multi-Pass Pipeline Architecture
The system evolved from a linear extraction to a contextual pipeline:
1.  **SIGNAL Pass:** High-recall, structural capture + `SignalMetadata` extraction.
2.  **CLASSIFY:** Label assignment using weighted Naive Bayes with Bigrams and Metadata-based special tokens.
3.  **SEMANTIC Pass:** High-precision, cleaned Markdown delivery.

---

## Current Survival Metrics (Last Audit: 2026-04-22)
- **Overall Validation Accuracy:** 91.63%
- **Functional:App Accuracy:** 100.00%
- **Restricted:Financial Accuracy:** 100.00%
- **Classification Latency:** 0.29ms
- **Bundle Size (Weights):** 1.5MB
- **Real-World Sample Count:** 235 (Target: 1000+).

---

## Future Trajectory: The "Beyond FastText" Horizon
- **FastText Runtime Audit:** Preliminary research indicates a ~600KB Wasm binary + ~1MB quantized model, which would push the total package near our 1.5MB limit. Furthermore, FastText is considered a legacy architecture.
- **Model2Vec Migration (The Frontrunner):** Identified **Model2Vec** as the primary successor. It offers 4x the speed of FastText and can be distilled to **~944KB** using int8 quantization and 32-dimensional embeddings while maintaining high semantic accuracy.
- **Dependency-Free Inference:** Investigating the feasibility of a pure-JS implementation of the Model2Vec pooling/embedding logic to avoid the overhead of heavy ML libraries.
- **Genomic Scaling:** Scaling `real_web_data` to 1000+ samples to support the training of a distilled Model2Vec architecture.
