# Specification: Classifier Labels Typing

## Overview
The AI classifier returns a predefined set of labels (e.g., "Informational:Blog", "Restricted:Financial"). Currently, both the TypeScript `edge`/`edge-core` packages and the Swift `AleteClassifier` package return a raw string. We want to convert this to explicit types.

## Objectives
- Extract the 13 defined categories from `m2v_head.json` into typed constructs.
- **TypeScript**: Export a `const ClassifierLabel` and `type ClassifierLabel = typeof ClassifierLabel[keyof typeof ClassifierLabel]`. Use this type in the `classify` and `predictProbabilities` return signatures, as well as `AleteEdgeResult.label` in `edge-core/src/types.ts`.
- **Swift**: Introduce a `public enum ClassifierLabel: String, CaseIterable, Codable` in the `AleteClassifierKit` package. Update the return types of `classify` and `predictProbabilities`. Handle legacy/unknown labels gracefully (e.g., adding an `other(String)` case or defaulting to `.otherGeneral` if a raw fallback is generated). Wait, in Swift since labels can technically contain arbitrary strings if NB falls back, we should handle parsing carefully, or type the main outputs and ensure NB maps to these same strings.
- Bump library versions by a minor version (e.g. 1.X.Y -> 1.(X+1).0).

## Core Frameworks
- **TypeScript**: Native `const` mapping.
- **Swift**: Enum with String Raw Values.
