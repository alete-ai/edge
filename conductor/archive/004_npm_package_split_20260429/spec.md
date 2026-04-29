# Specification: npm Package Split

## 1. Overview
The Alete Edge library currently bundles both extraction (HTML to Markdown) and classification (Genre categorization). This specification outlines the split into two distinct npm packages to optimize for size and platform-native adaptations.

## 2. Objectives
- **Decoupling:** Separate HTML manipulation/extraction from the ML-heavy classification engine.
- **Portability:** Enable Package 1 (Core) to serve as a reliable "Structural Signal" generator for non-JS classifiers (Swift/Go/Python).
- **Efficiency:** Reduce bundle size for consumers who only need extraction or who use a native classifier.

## 3. Package Architecture

### Package A: `@alete-ai/edge-core`
- **Responsibility:** Structural & Semantic HTML extraction, Sanitization.
- **Key Files:** 
    - `src/extractor.ts`
    - `src/sanitization/Redactor.ts`
    - `src/platform/dom.ts` (and shims)
- **Primary Signal:** Returns `StructuralMetadata` and `markdown`.

### Package B: `@alete-ai/edge` (Full)
- **Responsibility:** Complete "Alete Edge" experience, including categorization.
- **Key Files:**
    - `src/classifier.ts`
    - `src/model2vec_engine.ts`
    - `src/model/*` (Weights and Configs)
    - `src/index.ts` (Orchestrator)
- **Dependency:** Depends on `@alete-ai/edge-core`.

## 4. Technical Requirements
- **Shared Types:** All shared interfaces (e.g., `StructuralMetadata`, `AleteEdgeResult`) must be moved to `src/types.d.ts` or a shared location to avoid circular dependencies.
- **Dependency Management:** Package A must NOT depend on any Package B files.
- **Publishing:** Both packages should be publishable from the same repository (Monorepo/Workspace approach).
- **Weights Preservation:** Package B must continue to bundle the classifier weights correctly.

## 5. Success Metrics (Metabolic Sensors)
- **Core Size:** `@alete-ai/edge-core` install size should be < 1MB (compressed).
- **Classification Portability:** A Swift test suite can successfully ingest the output of `@alete-ai/edge-core`'s `STRUCTURAL` mode to drive classification.
- **Backwards Compatibility:** Users of the existing `@alete-ai/edge` package experience zero breaking changes in the API.
