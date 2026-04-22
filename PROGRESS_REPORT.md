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

---

## Architectural Evolution

### Multi-Pass Pipeline Architecture
The system evolved from a linear extraction to a contextual pipeline:
1.  **SIGNAL Pass:** High-recall, structural capture for the classifier.
2.  **CLASSIFY:** Label assignment using weighted Naive Bayes.
3.  **SEMANTIC Pass:** High-precision, cleaned Markdown delivery.

---

## Current Survival Metrics (Last Audit: 2026-04-22)
- **Overall Validation Accuracy:** 76.96%
- **Functional:App Accuracy:** 100.00%
- **Restricted:Financial Accuracy:** 100.00%
- **Sub-10ms Latency:** Verified.
- **Real-World Sample Count:** 69 (Target: 1000+).

---

## Future Trajectory
- **Semantic Migration:** Investigating FastText or FFNN for "General Web" categories (Social, Blogs) where vocabulary overlap is high.
- **Data Augmentation:** Scaling the real-world dataset to 100+ samples per category.
- **Structural Features:** Adding list-to-paragraph ratios and form counts to the classifier input.
