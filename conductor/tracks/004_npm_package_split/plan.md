# Implementation Plan: npm Package Split

## Phase 1: Structural Preparation
- [ ] Move shared types from `src/extractor.ts` and `src/index.ts` to `src/types.d.ts`.
- [ ] Audit imports in `src/classifier.ts` and `src/model2vec_engine.ts` to ensure they only reference types or Core files.
- [ ] Verify existing test suite passes with moved types.

## Phase 2: Package Segregation
- [ ] Initialize pnpm workspace at the root.
- [ ] Create `packages/edge-core` directory.
- [ ] Create `packages/edge` directory.
- [ ] Migrate files to their respective packages.
    - [ ] `packages/edge-core/src` <- `extractor.ts`, `sanitization/`, `platform/`.
    - [ ] `packages/edge/src` <- `classifier.ts`, `model2vec_engine.ts`, `index.ts`, `model/`.
- [ ] Configure `packages/edge/package.json` to depend on `@alete-ai/edge-core`.

## Phase 3: Build & Publish Configuration
- [ ] Update `tsup.config.ts` for both packages.
- [ ] Update root `package.json` scripts to handle workspace-wide builds and tests.
- [ ] Ensure `postbuild` script in `@alete-ai/edge` correctly copies model weights to the new dist path.
- [ ] Update `.github/workflows/publish.yml` to handle multiple packages.

## Phase 4: Validation & Testing
- [ ] Run `pnpm test` across all workspace packages.
- [ ] Create a "Smoke Test" that imports the new `@alete-ai/edge` and verifies full `process()` functionality.
- [ ] Create a "Substrate Test" that verifies `@alete-ai/edge-core` can run independently without Package B dependencies.

## Phase 5: CI/CD Pipeline Integrity
- [ ] Update CI workflows to run tests for both packages.
- [ ] Verify that `pnpm build` produces two valid artifacts.
