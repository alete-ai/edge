# Implementation Plan: npm Package Split

## Phase 1: Structural Preparation
- [x] Move shared types from `src/extractor.ts` and `src/index.ts` to `src/types.d.ts`.
- [x] Audit imports in `src/classifier.ts` and `src/model2vec_engine.ts` to ensure they only reference types or Core files.
- [x] Verify existing test suite passes with moved types.

## Phase 2: Package Segregation
- [x] Initialize pnpm workspace at the root.
- [x] Create `packages/edge-core` directory.
- [x] Create `packages/edge` directory.
- [x] Migrate files to their respective packages.
    - [x] `packages/edge-core/src` <- `extractor.ts`, `sanitization/`, `platform/`.
    - [x] `packages/edge/src` <- `classifier.ts`, `model2vec_engine.ts`, `index.ts`, `model/`.
- [x] Configure `packages/edge/package.json` to depend on `@alete-ai/edge-core`.

## Phase 3: Build & Publish Configuration
- [x] Update `tsup.config.ts` for both packages.
- [x] Update root `package.json` scripts to handle workspace-wide builds and tests.
- [x] Ensure `postbuild` script in `@alete-ai/edge` correctly copies model weights to the new dist path.
- [x] Update `.github/workflows/publish.yml` to handle multiple packages.

## Phase 4: Validation & Testing
- [x] Run `pnpm test` across all workspace packages.
- [x] Create a "Smoke Test" that imports the new `@alete-ai/edge` and verifies full `process()` functionality.
- [x] Create a "Substrate Test" that verifies `@alete-ai/edge-core` can run independently without Package B dependencies.

## Phase 5: CI/CD Pipeline Integrity
- [x] Update CI workflows to run tests for both packages.
- [x] Verify that `pnpm build` produces two valid artifacts.
