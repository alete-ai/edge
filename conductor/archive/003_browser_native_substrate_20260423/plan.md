# Implementation Plan: Browser-Native Substrate Refactor

## Phase 1: Structural Decoupling
- [x] Create `src/platform/` abstraction layer for DOM and Asset loading.
- [x] Implement `NativeDOMProvider` (Browser) and `LinkedomProvider` (Node).
- [x] Refactor `Extractor.ts` to use injected DOM provider.
- [x] Refactor `Model2VecEngine.ts` to remove direct Node.js imports in favor of `AssetProvider`.

## Phase 2: Build Optimization
- [x] Update `package.json` with `browser` and `exports` maps for platform-specific entry points.
- [x] Configure `tsup` for a dedicated `dist/browser/` bundle.
- [x] Implement `noExternal` and `external` logic to ensure `linkedom` and `onnxruntime-node` are excluded from browser builds.

## Phase 3: Validation & Verification
- [x] Create a local `examples/one-click-test.html` to verify native browser execution.
- [x] Benchmark bundle sizes and memory footprint.
- [x] Verify functionality in both Node.js (vitest) and a simulated browser environment.
- [x] Update `PROGRESS_REPORT.md` with the new architectural state.

## Phase 4: Integration
- [x] Test the new library build within the `chrome-extension` repository.
- [x] Final audit of all persona TTV commitments.
