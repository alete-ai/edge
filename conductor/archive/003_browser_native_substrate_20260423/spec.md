# Specification: Browser-Native Substrate Refactor

## Overview
Transform `Alete-Edge` into a lean, platform-agnostic library that utilizes native browser APIs when available and provides a frictionless "one-click" installation experience for web and extension developers.

## Objectives
- **Remove Redundant Entropy:** Replace `linkedom` with native `DOMParser` in browser environments.
- **Isolate Substrates:** Cleanly separate Node.js-only logic from core processing.
- **Optimize Assets:** Streamline model asset loading for varying bundler/host contexts.
- **Enable Universal Distribution:** Create a build target that works natively in modern browsers without polyfills.

## Core Frameworks
- **DOM Agnostic Extractor:** A bridge pattern for DOM manipulation.
- **Universal Asset Loader:** A resilient fetch-based provider for binary/JSON assets.
- **Cross-Platform ONNX Strategy:** Leveraging `@huggingface/transformers` with browser-compatible runtimes.

## Strategic Crucible: Persona Round Table

### The Alpha-Curator (Julian/Lyra Lens)
- **Need:** Immediate utility. I want to include this in a simple HTML page or Chrome extension popup and see it work.
- **Critique:** "A 3MB bundle is a heavy signal. Every KB is friction. If I have to configure Vite aliases just to classify a snippet, the signal is lost."
- **TTV Score:** **10/10** (Zero-config drop-in).

### The Optimizer (Maya/Serra Lens)
- **Need:** Efficiency. Don't waste my CPU cycles or memory on emulating what my browser already has.
- **Critique:** "Using `linkedom` in a browser is metabolic waste. It's like bringing a portable heater to a sauna. We need to leverage the native substrate."
- **TTV Score:** **9/10** (Substantial performance boost on web).

### The Digital Ascetic (Aris/Julian Lens)
- **Need:** Clarity and noise reduction. No cryptic Node errors in my browser console.
- **Critique:** "Seeing `fs` and `path` warnings in my Chrome console is sensory static. The library should be invisible until it's delivering value."
- **TTV Score:** **10/10** (Clean console, clean imports).

## Survival Metrics
- **Bundle Size Reduction:** >30% (uncompressed) by externalizing/dropping Node-only deps in browser builds.
- **Bootstrap Latency:** <200ms for library initialization in a standard browser tab.
- **Friction Check:** Zero standard polyfills (buffer, process, path) required for browser use.
