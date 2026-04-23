# Specification: Neural Substrate Optimization

## Overview
This track focuses on reducing the total footprint of the `@alete-ai/edge` library from its current ~22MB to a target of ≤10MB. We will achieve this through quantization of the neural embeddings and externalizing model assets to eliminate the 33% Base64 encoding overhead while maintaining a "zero-config" developer experience.

## Objectives
- **Substrate Condensation**: Deliver two tiers of neural substrates:
  - **Standard (Int4)**: ~1.8MB @ 96.14% accuracy (The default metabolic choice).
  - **Max (Int8)**: ~3.6MB @ 96.54% accuracy (The high-status performance choice).
- **Dual-Substrate Management**: Maintain `m2v_embeddings.full.bin` (Float32) in the repository for archival reference.
- **Substrate Tiering**: Implement sub-exports in `package.json` to allow users to switch between tiers easily.
- **Metabolic Efficiency**: Target total package size ≤10MB including both tiers.
- **Mythos Documentation**: Update README.md with installation and performance metrics for both tiers.

## Baseline Metrics (2026-04-23)
- **Overall Accuracy**: 90.43%
- **Total Samples**: 12,422 (Val: 1,243)
- **Library Size**: ~22MB (Bundled index.js)
- **Per-Bucket Accuracy (Key Targets)**:
  - Restricted:Financial: 99.07%
  - Functional:App: 99.38%
  - Informational:News: 77.60%
  - Informational:Research: 73.20%

## Core Frameworks
- **Quantization**: Custom script for binary conversion.
- **Bundling**: `tsup` (esbuild) with externalized assets.
- **Resolution**: `import.meta.url` for Node/Browser relative path discovery.
- **Validation**: `vitest` and `training/train_model.js` (inference audit).
