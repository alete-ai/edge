# Implementation Plan: EdgePulse

## Phase 1: Substrate Initialization (Library Setup) [x]
- [x] Initialize project root structure.
- [x] Initialize `package.json` with AGPL-3.0 license and `edge-pulse` name.
- [x] Configure `tsconfig.json` for modern TS (ESM).
- [x] Add `LICENSE` file (AGPL-3.0).
- [x] Add comprehensive root `README.md` using the Soil/Botanist/Pulse metaphors.
- [x] Add proper root `.gitignore`.

## Phase 2: The Training Pipeline (Python & HuggingFace) [x]
- [x] Create `training/` directory.
- [x] Add `requirements.txt` for Python dependencies (`datasets`, `pandas`, etc.).
- [x] Write `fetch_dataset.py` to download multi-source datasets (X-GENRE, US Bank) from HuggingFace.
- [x] Write `generate_synthetic.py` to create training samples for Functional and Restricted categories.
- [x] Write `train_model.js` to process datasets, map to hierarchical labels, train the classifier, and export `weights.json`.

## Phase 3: The EdgePulse Runtime (TS Implementation) [x]
- [x] Install runtime dependencies: `linkedom`, `dom-to-semantic-markdown`, `wink-nlp`, etc.
- [x] Implement `src/extractor.ts` (HTML -> DOM -> Markdown).
- [x] Implement `src/classifier.ts` (Markdown -> Hierarchical Label).
- [x] Implement `src/index.ts` exporting the unified `EdgePulse` API.

## Phase 4: Testing & Integration [x]
- [x] Set up Vitest in the library.
- [x] Write unit tests for extraction and classification.
- [x] Implement integration tests using `ts-mockito`.
- [ ] (Future Track) Replace inline implementation in `apps/extension` with the new `@vedai/edge-pulse` package.
