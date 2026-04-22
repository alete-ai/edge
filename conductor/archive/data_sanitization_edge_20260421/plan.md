# Implementation Plan: EdgePulse Privacy-First Data Sanitization Layer

This plan outlines the "Structural Resilience" and "Metabolic Efficiency" path for the `data-sanitization-edge` track. We follow the **Research -> Strategy -> Execution** lifecycle with explicit "Survival Metrics."

## Phase 1: Substrate Preparation & Setup
Goal: Establish the technical foundation for the sanitization layer.

- [x] **Research: Library Benchmarking**
    - [x] Evaluate `@hackylabs/deep-redact` for edge runtime compatibility.
    - [x] Confirm "Structural Resilience" (zero-dependency) in browser and workers.
- [x] **Setup: Module Scaffold**
    - [x] Create `src/sanitization/` directory.
    - [x] Create `Redactor.ts` class with basic redact functionality.
- [x] **Install Dependencies**
    - [x] `@hackylabs/deep-redact` (already present in root `package.json`).

## Phase 2: Pattern Evolution (Regex Development)
Goal: Develop robust, high-accuracy patterns for sensitive data.

- [x] **PII Pattern Development**
    - [x] Implement and test regex for Emails, Phone Numbers, and Addresses.
    - [x] Add support for international SSN and ID patterns.
- [x] **Financial Pattern Development**
    - [x] Implement Credit Card patterns (Luhn-compliant where possible).
    - [x] Add IBAN and SWIFT/BIC detection.
- [x] **Credentials Pattern Development**
    - [x] Add API Key patterns (AWS, Stripe, OpenAI, etc.).
    - [x] Implement detection for SSH keys and common password fields.
- [x] **Optimization: Performance Edge**
    - [x] Audit all regex for "Catastrophic Backtracking" to ensure "Metabolic Efficiency."

## Phase 3: Pipeline Integration
Goal: Seamlessly integrate the sanitization layer into the EdgePulse ingestion pipeline.

- [x] **Ingestion Hook**
    - [x] Identify the exact "Pulse Point" in the ingestion pipeline where markdown is finalized.
    - [x] Insert the `Redactor.redact()` call after classification but before output.
- [x] **Configuration Layer**
    - [x] Allow users to toggle specific categories (e.g., `redactFinancials: true`).
    - [x] Implement custom placeholder overrides (e.g., `[SECRET]` instead of `[REDACTED]`).

## Phase 4: Validation & Survival Testing
Goal: Verify the "Privacy-by-Design" mandate with empirical proof.

- [x] **Automated Testing: Privacy Shield**
    - [x] Create `src/sanitization/Redactor.spec.ts`.
    - [x] Run test cases against 50+ "Toxic" markdown snippets (simulated sensitive data).
- [x] **Benchmarking: Metabolic Sensor**
    - [x] Measure latency overhead on large markdown files (10KB - 100KB).
    - [x] Ensure the "Performance Edge" (<10ms per 1KB) is maintained.
- [x] **Documentation: The Mythos**
    - [x] Document the sanitization layer as a key "High-Status" feature in the main README.
    - [x] Provide examples of "Clean Signals" for the Marcus (GTM) persona.
