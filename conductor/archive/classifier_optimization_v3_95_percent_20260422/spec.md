# Specification: Classifier Precision Optimization (>95%)

## Overview
This track represents the "Elite Evolution" of the Alete-Edge classifier. We aim to reach >95% overall precision across all 13 categories, specifically targeting the currently weak "General Web" categories (Blogs, Forums, News). 

## Objectives
- [ ] **Semantic Migration:** Transition from a pure "Bag-of-Words" Naive Bayes to a Semantic-aware classifier (e.g., FastText or Lightweight FFNN on embeddings).
- [ ] **Structural Feature Engineering:** Ingest non-textual features (Link density, list-to-paragraph ratios, button counts) to the classification signal.
- [ ] **Real-World DNA Expansion:** Scale the `web_ingestion` dataset from 69 to 1000+ samples.
- [ ] **Latency Ceiling:** Ensure classification remains <10ms for use in low-power edge environments.

## Core Frameworks
- **Classifier Candidate A:** `FastText` (high-speed semantic embeddings).
- **Classifier Candidate B:** Feed-Forward Neural Network (FFNN) using `tensorflow.js` or a custom lightweight matrix implementation.
- **Preprocessing:** `wink-nlp` (maintained for tokenization/stemming).

## Success Metrics (Survival Metrics)
- **Overall Accuracy:** >95% on a held-out real-world validation set.
- **Critical Category Accuracy:** 100% for `Functional:App` and `Restricted:Financial`.
- **Classification Latency:** <10ms.
- **Bundle Size:** <1.5MB for model + weights.
