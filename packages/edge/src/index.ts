import { Extractor, Redactor } from '@alete-ai/edge-core'
import { ExtractMode, type AleteEdgeOptions, type AleteEdgeResult, type AleteEdgeTiming } from '@alete-ai/edge-core/types'
import { ContentClassifier } from './classifier.js'

export class AleteEdge {
  private extractor: Extractor
  private classifier: ContentClassifier
  private redactor?: Redactor

  constructor(options: AleteEdgeOptions = {}, overrides?: { extractor?: Extractor, classifier?: ContentClassifier, redactor?: Redactor }) {
    this.extractor = overrides?.extractor || new Extractor(options)
    this.classifier = overrides?.classifier || new ContentClassifier(options.modelPath)

    if (overrides?.redactor) {
      this.redactor = overrides.redactor
    } else if (options.redactor !== false) {
      const redactorOptions = typeof options.redactor === 'object' ? options.redactor : {}
      this.redactor = new Redactor(redactorOptions)
    }
  }

  /**
   * Processes a raw HTML string and returns semantic Markdown and a genre label.
   * Implementation follows a two-pass strategy:
   * 1. STRUCTURAL Pass: Extract markers (buttons, labels) for accurate categorization.
   * 2. SEMANTIC Pass: Clean, article-like extraction for LLM consumption.
   */
  public async process(html: string): Promise<AleteEdgeResult> {
    const perf = globalThis.performance
    const t0 = perf.now()
    
    // Pass 1: Structural Extraction for Categorization
    const ts1 = perf.now()
    const extractionResult = await this.extractor.extractWithMetadata(html, ExtractMode.STRUCTURAL)
    const te1 = perf.now()

    const structuralMarkdown = extractionResult?.markdown || ''
    const structuralMetadata = extractionResult?.metadata || {
      buttonCount: 0,
      linkCount: 0,
      imageCount: 0,
      wordCount: 0,
      linkToWordRatio: 0,
      paragraphCount: 0,
      listCount: 0
    }

    const tc_start = perf.now()
    const label = await this.classifier.classify(structuralMarkdown, structuralMetadata)
    const tc_end = perf.now()

    // Pass 2: Semantic Extraction for high-fidelity output
    const ts2 = perf.now()
    const semanticResult = await this.extractor.extract(html, ExtractMode.SEMANTIC)
    let markdown = (typeof semanticResult === 'object' ? semanticResult.markdown : semanticResult) || ''
    const pageMetadata = typeof semanticResult === 'object' ? semanticResult.pageMetadata : {}
    const te2 = perf.now()

    let hasSensitiveInfo = false
    const tr_start = perf.now()
    if (this.redactor) {
      const redactionResult = await this.redactor.process(markdown)
      markdown = redactionResult.redacted
      hasSensitiveInfo = redactionResult.hasSensitiveInfo
    }
    const tr_end = perf.now()

    const t_total = perf.now()

    return {
      markdown,
      label,
      hasSensitiveInfo,
      metadata: {
        ...structuralMetadata,
        page: { ...structuralMetadata.page, ...pageMetadata },
        charCount: markdown.length,
      },
      timing: {
        total: t_total - t0,
        extraction_structural: te1 - ts1,
        categorization: tc_end - tc_start,
        extraction_semantic: te2 - ts2,
        redaction: tr_end - tr_start,
      }
    }
  }

  /**
   * Only extract markdown without categorization. Defaults to SEMANTIC mode.
   */
  public async extract(html: string, mode: ExtractMode = ExtractMode.SEMANTIC): Promise<string | undefined> {
    const result = await this.extractor.extract(html, mode)
    let markdown = typeof result === 'object' ? result.markdown : result
    
    if (markdown && this.redactor) {
      markdown = await this.redactor.redact(markdown)
    }
    return markdown
  }

  /**
   * Only categorize text without extraction.
   */
  public async categorize(text: string): Promise<string> {
    return this.classifier.classify(text)
  }
}
