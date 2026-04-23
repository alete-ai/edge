# Implementation Plan: @alete-ai/edge NPM Bundling

## Phase 1: Environment Preparation
- [x] Install `tsup` as a dev dependency.
- [x] Rename package in `package.json` to `@alete-ai/edge`.
- [x] Update `author` to `Stoyan Dimitrov <https://github.com/StoyanD>` (per project context).

## Phase 2: Build Configuration
- [x] Create `tsup.config.ts` to bundle `src/index.ts`.
- [x] Configure asset copying for `weights.json`.
- [x] Map `exports` in `package.json` for ESM and CJS.

## Phase 3: Validation & CI
- [x] Add `build` and `prepublishOnly` scripts.
- [x] Run `pnpm pack` and inspect the distribution tarball.
- [x] Create `.github/workflows/ci.yml` for build and test validation.
- [x] Create `.github/workflows/publish.yml` for automated releases.

## Phase 4: Performance Monitoring
- [x] Implement bundle-size tracking for performance monitoring.

## Phase 5: Identity Refactor
- [x] Refactor legacy symbols to `AleteEdge` in `src/index.ts`.
- [x] Refactor legacy result type to `AleteEdgeResult`.
- [x] Update all tests (`.spec.ts`) to use the new identity.
- [x] Verify build and bundle integrity.
