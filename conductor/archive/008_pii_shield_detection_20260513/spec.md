# Specification: PII Shield Detection (Medical & Enhanced Privacy)

## Overview
This specification defines the enhancements to the `@alete-ai/edge-core` redaction engine to support the "Quiet Shield" initiative for Alete's App Store submission. We are adopting a "Substrate Swap" strategy, replacing custom regex logic with the `openredaction` library to gain access to 570+ industry-standard patterns.

## Objectives
- **Substrate Swap:** Integrate `openredaction` as the core detection engine.
- **HIPAA Alignment:** Enable the HIPAA preset for robust medical data detection (18 identifiers).
- **Refined Security:** Enhance PASSWORD and credential detection via industry-vetted patterns.
- **Detector API:** Provide a `hasSensitiveInfo` method to return a boolean if sensitive data is present.

## Core Requirements

### 1. Medical Data Detection (HIPAA)
Leverage the `openredaction` HIPAA preset to detect:
- Medical history/diagnoses.
- Prescription drug names.
- Health insurance policy numbers.
- Patient identifiers (MRNs).

### 2. Enhanced Security Detection
- Detect high-entropy strings (API keys, secrets).
- Improved label-based detection for passwords and recovery phrases.

### 3. Detector API (`Redactor.hasSensitiveInfo`)
Add a method to the `Redactor` class that returns a boolean if any sensitive information is found, avoiding unnecessary double processing (redact vs check).

## Implementation Strategy
- **Sovereign Wrapper:** Maintain the `Redactor` class in `packages/edge-core/src/sanitization/Redactor.ts` as an anti-corruption layer.
- **Library Integration:** Use `openredaction` inside the `Redactor` class.
- **Configuration:** Map `RedactorOptions` to `openredaction` settings, defaulting to high-sensitivity presets.
- **Performance:** Ensure zero-dependency, regex-based performance suitable for edge environments.
