# Implementation Plan: PII Shield Detection

## Phase 1: Substrate Preparation
- [x] Update `packages/edge-core/src/types.ts` to include `redactMedical` and `hasSensitiveInfo` types.
- [x] Install `openredaction` and remove `@hackylabs/deep-redact`.
- [x] Increment minor version to `0.5.0` for `edge` and `edge-core`.

## Phase 2: Core Implementation
- [x] Refactor `Redactor.ts` to wrap `OpenRedaction`.
- [x] Implement `hasSensitiveInfo()` and `process()` methods using `openredaction.detect()`.
- [x] Implement "Narrative-First" strategy: Preserve names/dates, redact toxic identifiers.

## Phase 3: Validation & Testing
- [x] Update `Redactor.spec.ts` with comprehensive health/pii/financial test cases.
- [x] Verify Narrative Preservation in tests.
- [x] Benchmark performance for large text blocks on edge-simulated environments.

## Phase 4: Release
- [x] Build the library (`pnpm build`).
- [x] Prepare for consumption by the main Alete monorepo.
