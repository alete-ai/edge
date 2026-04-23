# Specification: Real-World Data Ingestion & Signal Training

## Overview
This track focuses on evolving the classifier's "Substrate" from synthetic-heavy to real-world dominant. We will ingest 20+ real-world examples per category by fetching raw HTML from the web and processing it using `ExtractMode.SIGNAL`.

## Objectives
- [ ] **Curated URL Map:** Build a registry of 20+ high-fidelity URLs per genre category.
- [ ] **Automated Ingestion Script:** Create `training/ingest_web.ts` to fetch HTML, extract `SIGNAL` Markdown, and label the content.
- [ ] **Data Partitioning:** Implement a 80/20 train/test split for this real-world dataset.
- [ ] **Signal Training:** Retrain the model focusing on the extracted structural markers (brackets, UI labels) from these real pages.

## Core Frameworks
- **Fetcher:** `node-fetch` or `axios` for web requests.
- **Extractor:** `AleteEdge` in `SIGNAL` mode.
- **Dataset Manager:** Updated `training/fetch_dataset.py` or new `ingest_web.ts`.

## Success Metrics (Survival Metrics)
- Total real-world dataset size of at least 260 samples (13 categories * 20 URLs).
- >95% accuracy on the "Real-World Test Set" after retraining.
- Validation that `SIGNAL` mode markers effectively represent the underlying category phenotype.
