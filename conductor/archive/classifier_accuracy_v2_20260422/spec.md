# Specification: Classifier Precision Upgrade (v2)

## Overview
The current Content Classifier (based on `wink-naive-bayes-text-classifier`) is over-generalizing and misclassifying critical user contexts. Specifically, long lists of news headlines are being labeled as `Informational:Research`, and user profile/login pages are being labeled as `Educational:Instruction`.

## Objectives
- [x] Reproduce the misclassifications with a local script.
- [ ] **Substrate Resilience:** Resolve "Readability Erosion" where `mozilla/readability` strips content from non-article pages (Dashboards, Logins).
- [ ] **Signal Preservation:** Audit and relax `ignoredTags` (currently stripping `form`, `button`, `nav`) to preserve "Functional:App" features.
- [ ] Differentiate `Informational:News` (Headlines) from `Informational:Research` (Long-form content).
- [ ] Securely identify `Functional:App` (Login, Settings, Profile) without triggering `Educational:Instruction`.
- [ ] Explore migration to a more robust "Semantic" classifier if data refinement is insufficient.

## Core Frameworks
- **Current Substrate:** `wink-nlp` + `wink-naive-bayes-text-classifier`.
- **Target Substrate:** TBD (Refined Naive Bayes or migration to Embedding-based FFNN).
- **Data Sources:** X-GENRE, MTSamples, Synthetic Data, and NEW News/App datasets.

## Success Metrics (Survival Metrics)
- >95% Accuracy on a validation set of 100 Login/App pages.
- >95% Accuracy on a validation set of 100 News Headline lists.
- Maintenance of <10ms classification latency.
- Bundle size remains within "Metabolic Limits" (<1MB for model weights).
