# Specification: @alete-ai/edge NPM Bundling

## Overview
Transform the internal library into a distributable npm package under the `@alete-ai` scope.

## Objectives
- **Technical Transition**: Rename from the internal name to `@alete-ai/edge`.
- **Identity Alignment**: Refactor library symbols to `AleteEdge`.
- **Package Distribution**: Ensure `src/model/weights.json` is packaged and accessible.
- **Dual-Module Support**: Provide ESM and CJS outputs.
- **Validation**: Implement a pre-publish verification suite.

## Core Frameworks
- **Bundler**: `tsup` (for performance and zero-config ESM/CJS).
- **Package Manager**: `pnpm`.
- **Environment**: Node.js & Browser (Edge).
