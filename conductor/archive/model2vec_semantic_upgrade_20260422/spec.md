# Specification: Model2Vec Semantic Edge Upgrade

## Overview
This track represents the "Neural Ascension" of the Alete-Edge classifier. We are moving beyond the legacy FastText architecture to **Model2Vec**, a modern, lightweight embedding distillation technique that provides Transformer-level semantic awareness at the edge.

## Objectives
- **Precision:** Achieve **>95% overall accuracy** across all 13 categories.
- **Footprint:** Maintain total bundle size (weights + runtime) **<1.5MB**.
- **Latency:** Sustain **<10ms inference** (targeting <2ms on modern mobile hardware).
- **Substrate Independence:** Implement a **Pure-JS inference engine** for Model2Vec to avoid heavy ML library dependencies.

## Core Frameworks & Principles
1. **Distillation:** Use `minishlab/model2vec` to distill a Sentence Transformer (e.g., `potion-base-8M`) into a static embedding model.
2. **Quantization:** Apply `int8` quantization to the embedding table.
3. **Dimensionality Reduction:** Utilize PCA/Autoencoders to reduce embeddings to 32 dimensions.
4. **Weighted Pooling:** Implement a pure-JS "Mean Pooling" strategy for sentence-level representation.
5. **Linear Classifier:** Train a lightweight linear head (softmax) on top of the fixed embeddings.

## Survival Metrics (TTV)
- **The Alpha-Curator (Marcus):** **10/10** (95% accuracy makes the product "uninvadable").
- **The Optimizer (Sarah):** **9/10** (Model size stays low, performance increases 4x).
- **The Neural Architect (Leo):** **10/10** (Modern architecture provides a path for future reasoning capabilities).
