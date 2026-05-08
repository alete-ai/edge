# Specification: mdream Migration & Title Extraction

## 1. Overview
Alete Edge requires high-fidelity article extraction and structural metadata for classification. The current pipeline (Readability + dom-to-semantic-markdown) is losing titles and has fragmented configuration for structural vs. semantic modes.

## 2. Objectives
- **Title Extraction**: Guarantee that article titles are included in the generated Markdown.
- **Unified Pipeline**: Use `mdream` for both semantic and structural modes.
- **Structural Parity**: Ensure `STRUCTURAL` mode still produces UI markers like `[Button]` for the classifier.
- **Semantic Parity**: Ensure `SEMANTIC` mode maintains low-noise article content.
- **Classifier Validation**: Verify if the change in Markdown format affects `model2vec` inference accuracy.

## 3. Core Frameworks
- **Primary Library**: `mdream` (Modern JS/TS HTML-to-Markdown converter).
- **Secondary Library**: `@mozilla/readability` (Retained if `mdream`'s `isolateMain` is insufficient for complex articles).
- **Validation**: `vitest` for parity tests; parity script for model2vec comparison.

## 4. Extraction Modes
### Semantic Mode
- **Goal**: Clean article text for user reading and summarization.
- **Features**: Frontmatter (title), boilerplate removal, clean links.

### Structural Mode
- **Goal**: Representation of UI elements for classification.
- **Features**: UI markers `[Button]`, `[Link]`, element counts (metadata).

## 5. Success Metrics (Survival Metrics)
- 100% of tested articles include a title in the Markdown output.
- Structural metadata (buttonCount, linkCount) matches current counts within 5% margin.
- Classifier prediction parity > 98% (or retrain if distribution shifts significantly).
