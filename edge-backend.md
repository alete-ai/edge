# Alete-Edge: Backend SaaS & iOS Edge Strategy

## Strategic Crucible: Performance Audit

The Alete-Team has evaluated the transition from legacy statistical models to a "Hydra" architecture that combines high-fidelity backend classification with ultra-lightweight edge offloading.

### 1. Research Summary: Model2Vec vs. Sentence Transformers

Model2Vec (specifically the `potion` series) represents a "Neural Upgrade" over legacy static embeddings (FastText/GloVe) and a "Metabolic Optimization" over full Transformers (BERT/SBERT).

| Metric | Sentence Transformer (all-MiniLM-L6-v2) | Model2Vec (potion-base-32M) | Improvement |
| :--- | :--- | :--- | :--- |
| **Inference Speed (CPU)** | 1x (Baseline) | **500x faster** | 🚀 Massive |
| **Throughput** | ~500 docs/sec | **~100,000 docs/sec** | 🚀 Massive |
| **Model Size** | ~100 MB | **~30 MB (Full) / 1.8MB (Int4)** | 📉 50x smaller |
| **Accuracy (MTEB Avg)** | 56.09 | 52.83 | ⚠️ ~6% drop |

### 2. iOS Edge Offloading: Apple Foundation API

Apple's **`NLContextualEmbedding`** (iOS 17+) and **`NLEmbedding`** provide a "zero-bundle-size" path for on-device intelligence.

- **Substrate:** BERT-based architecture optimized for the **Apple Neural Engine (ANE)**.
- **Latency:** Estimated <20ms per inference.
- **Zero Overhead:** Managed by the OS; 0MB added to the app binary.
- **Calibration:** Requires high confidence thresholds (>0.92) due to high baseline similarity in the Apple vector space.

### 3. "Hydra" Architecture for SaaS Expansion

To scale to hundreds of labels for external customers while maintaining the Alete "Neural Edge":

#### Tier 1: The Edge Substrate (Mobile/Browser)
- **Universal Engine:** Use our pure-JS **Int4 Model2Vec Engine** (1.8MB) for cross-platform parity.
- **Native Shim:** Detect iOS environment and pivot to `NLContextualEmbedding` for zero-power ingestion.
- **Signal Clarity:** Preserve bracketed UI markers (`[Login]`, `[Submit]`) in the extraction phase to prevent "Semantic Blindness."

#### Tier 2: The Backend Substrate (SaaS)
- **Heavy Head:** Deploy a 1024-unit MLP Classification Head on top of `potion-base-32M`.
- **Hierarchical Taxonomy:** Scale labels (e.g., `Restricted:Financial:Crypto`) to maintain precision at scale.
- **Scale-to-Zero:** Use CPU-native Model2Vec to avoid the cost of persistent GPU instances.

### 4. Standard Interface: The Two-Pass Structural Signal
To maintain "Signal Clarity" while minimizing "Metabolic Cost," all external integrations (SaaS and Edge) must utilize the Alete **Two-Pass Strategy**:

1. **Pass 1: STRUCTURAL (The Signal)**
   - **Action:** Transform raw DOM/HTML into **Structural Markdown**.
   - **Markers:** Convert UI elements (buttons, links, labels) into bracketed semantic tokens like `[Login]` or `[Submit]`.
   - **Metadata:** Inject structural counts (Link Density, Button Ratios) as weighted tokens.
   - **Goal:** Provide a compressed, high-signal substrate for the Model2Vec engine.

2. **Pass 2: SEMANTIC (The Substrate)**
   - **Action:** Perform a clean, high-fidelity extraction (via Readability/dom-to-semantic-markdown).
   - **Goal:** Deliver the final content to the LLM or storage layer only after Pass 1 has confirmed the classification.

### 5. Optional: Native iOS Substrate for Model2Vec
For maximum "Evolutionary Fitness" on Apple platforms, we can port the Model2Vec engine to a native Swift implementation:
- **Swift + Accelerate:** Use Apple's `Accelerate` framework (vDSP/BNNS) for ultra-fast vector math.
- **CoreML Hybrid:** Export the MLP classification head as a `.mlmodel` for ANE (Apple Neural Engine) acceleration.
- **Fixed Latency:** Achieve sub-1ms inference with 100% logic parity between Edge and Backend.
- **Substrate Stability:** Maintain a 1.8MB Int4 binary footprint as a native asset.

---

## Survival Metrics

| Persona | TTV Score | Success Metric |
| :--- | :--- | :--- |
| **The Alpha-Curator** | **High** | Instant classification with no UI spinners. |
| **The Optimizer** | **Extreme** | 90% reduction in compute cost vs. Transformers. |
| **The Digital Ascetic** | **High** | Privacy-first, local-only processing on iOS. |
