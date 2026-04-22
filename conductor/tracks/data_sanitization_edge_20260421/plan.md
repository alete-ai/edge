# Implementation Plan: EdgePulse Privacy-First Data Sanitization Layer

This plan outlines the "Structural Resilience" and "Metabolic Efficiency" path for the `data-sanitization-edge` track. We follow the **Research -> Strategy -> Execution** lifecycle with explicit "Survival Metrics."

## Phase 1: Substrate Preparation & Setup
Goal: Establish the technical foundation for the sanitization layer.

- [ ] **Research: Library Benchmarking**
    - [ ] Evaluate `@hackylabs/deep-redact` for edge runtime compatibility.
    - [ ] Confirm "Structural Resilience" (zero-dependency) in browser and workers.
- [ ] **Setup: Module Scaffold**
    - [ ] Create `packages/edge-pulse/src/sanitization/` directory.
    - [ ] Create `Redactor.ts` class with basic redact functionality.
- [ ] **Install Dependencies**
    - [ ] `pnpm add @hackylabs/deep-redact` in `packages/edge-pulse/`.

## Phase 2: Pattern Evolution (Regex Development)
Goal: Develop robust, high-accuracy patterns for sensitive data.

- [ ] **PII Pattern Development**
    - [ ] Implement and test regex for Emails, Phone Numbers, and Addresses.
    - [ ] Add support for international SSN and ID patterns.
- [ ] **Financial Pattern Development**
    - [ ] Implement Credit Card patterns (Luhn-compliant where possible).
    - [ ] Add IBAN and SWIFT/BIC detection.
- [ ] **Credentials Pattern Development**
    - [ ] Add API Key patterns (AWS, Stripe, OpenAI, etc.).
    - [ ] Implement detection for SSH keys and common password fields.
- [ ] **Optimization: Performance Edge**
    - [ ] Audit all regex for "Catastrophic Backtracking" to ensure "Metabolic Efficiency."

## Phase 3: Pipeline Integration
Goal: Seamlessly integrate the sanitization layer into the EdgePulse ingestion pipeline.

- [ ] **Ingestion Hook**
    - [ ] Identify the exact "Pulse Point" in the ingestion pipeline where markdown is finalized.
    - [ ] Insert the `Redactor.redact()` call after classification but before output.
- [ ] **Configuration Layer**
    - [ ] Allow users to toggle specific categories (e.g., `redactFinancials: true`).
    - [ ] Implement custom placeholder overrides (e.g., `[SECRET]` instead of `[REDACTED]`).

## Phase 4: Validation & Survival Testing
Goal: Verify the "Privacy-by-Design" mandate with empirical proof.

- [ ] **Automated Testing: Privacy Shield**
    - [ ] Create `packages/edge-pulse/src/sanitization/Redactor.spec.ts`.
    - [ ] Run test cases against 50+ "Toxic" markdown snippets (simulated sensitive data).
- [ ] **Benchmarking: Metabolic Sensor**
    - [ ] Measure latency overhead on large markdown files (10KB - 100KB).
    - [ ] Ensure the "Performance Edge" (<10ms per 1KB) is maintained.
- [ ] **Documentation: The Mythos**
    - [ ] Document the sanitization layer as a key "High-Status" feature in the main README.
    - [ ] Provide examples of "Clean Signals" for the Marcus (GTM) persona.
