# Implementation Plan: @alete-ai/edge NPM Bundling

## Phase 1: Substrate Preparation
- [ ] Install `tsup` as a dev dependency.
- [ ] Rename package in `package.json` to `@alete-ai/edge`.
- [ ] Update `author` to `Stoyan Dimitrov <https://github.com/StoyanD>` (per project context).

## Phase 2: Build Configuration
- [ ] Create `tsup.config.ts` to bundle `src/index.ts`.
- [ ] Configure asset copying for `weights.json`.
- [ ] Map `exports` in `package.json` for ESM and CJS.

## Phase 3: Validation & CI
- [ ] Add `build` and `prepublishOnly` scripts.
- [ ] Run `pnpm pack` and inspect the "tarball" (Phenotype).
- [ ] Create `.github/workflows/publish.yml` for automated releases.

## Phase 4: Primal Sensors (Analytics)
- [ ] Implement bundle-size tracking for "Metabolic Efficiency".
