# Implementation Plan: mdream Migration & Title Extraction

## Phase 1: Research & Scaffolding
- [x] Research `mdream` advanced configuration via Context7 for specific Alete Edge markers.
- [x] Create parity test suite in `packages/edge-core/src/parity.spec.ts`.
- [x] Benchmark current `dom-to-semantic-markdown` output against `mdream`.

## Phase 2: Implementation (edge-core)
- [x] Replace `dom-to-semantic-markdown` with `mdream` in `packages/edge-core/package.json`.
- [x] Implement `mdream` pipeline in `Extractor.ts`.
    - [x] Configure `frontmatter: true` for title extraction.
    - [x] Implement `tagOverrides` for `STRUCTURAL` mode markers.
    - [x] Implement `filter` and `isolateMain` for `SEMANTIC` mode.
- [x] Update `calculateStructuralMetadata` to use `mdream`'s `extraction` plugin if more efficient.

## Phase 3: Classifier Parity & Validation
- [x] Run `scripts/generate_parity_data.ts` to compare old vs. new Markdown outputs.
- [x] **Data Parity Check**: Compare word counts and element density.
- [x] **Classifier Audit**: Run existing `model2vec` on new Markdown data.
- [x] Decide on retraining: If accuracy drops > 2%, initiate retraining pipeline.

## Phase 4: Integration & CI/CD
- [x] Run full test suite: `pnpm test`.
- [x] Verify `edge` package integration.
- [x] Update documentation (READMEs).

## Phase 5: Testing & Analytics (Primal Sensors)
- [x] Add telemetry for "Title Found" rate in production.
- [x] Unit tests for multi-mode switching.
- [x] Build integrity check for XCFramework distribution.

## Phase 6: Post-Migration Cleanup
- [x] Remove `dom-to-semantic-markdown` dependency from `packages/edge-core`.
- [x] Remove legacy Readability wrapping logic if `mdream`'s `isolateMain` is fully adopted.
- [x] Prune unused test assets and old parity data.
- [x] Archive the track.
