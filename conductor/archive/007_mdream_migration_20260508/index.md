# Track 007: mdream Migration & Title Extraction

## Overview
This track focuses on upgrading the HTML-to-Markdown extraction engine from `dom-to-semantic-markdown` + `@mozilla/readability` to a unified or enhanced pipeline using `mdream`.

### Artifacts
- [Specification](./spec.md)
- [Implementation Plan](./plan.md)
- [Metadata](./metadata.json)

### Context
- **Issue**: Current conversion often misses article titles.
- **Solution**: Switch to `mdream` which provides native frontmatter extraction (titles) and better LLM-optimized structural fidelity.
- **Impact**: Requires validation against existing `model2vec` classifier to ensure data distribution parity.
