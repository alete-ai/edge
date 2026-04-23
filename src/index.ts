import { Extractor, ExtractMode, type ExtractorOptions, type SignalMetadata } from './extractor.js'
import { ContentClassifier } from './classifier.js'
import { Redactor, type RedactorOptions } from './sanitization/Redactor.js'

export interface AleteEdgeOptions extends ExtractorOptions {
  redactor?: RedactorOptions | boolean
}

export interface AleteEdgeTiming {
  total: number
  extraction_signal: number
  classification: number
  extraction_semantic: number
  redaction: number
}

export interface AleteEdgeResult {
  markdown: string
  label: string
  metadata?: SignalMetadata & {
    charCount: number
  }
  timing?: AleteEdgeTiming
}

export class AleteEdge {
  private extractor: Extractor
  private classifier: ContentClassifier
  private redactor?: Redactor

  constructor(options: AleteEdgeOptions = {}, overrides?: { extractor?: Extractor, classifier?: ContentClassifier, redactor?: Redactor }) {
    this.extractor = overrides?.extractor || new Extractor(options)
    this.classifier = overrides?.classifier || new ContentClassifier()

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
   * 1. SIGNAL Pass: Extract markers (buttons, labels) for accurate classification.
   * 2. SEMANTIC Pass: Clean, article-like extraction for LLM consumption.
   */
  public async process(html: string): Promise<AleteEdgeResult> {
    const perf = globalThis.performance
    const t0 = perf.now()
    
    // Pass 1: Signal Extraction for Classification
    const ts1 = perf.now()
    const extractionResult = this.extractor.extractWithMetadata(html, ExtractMode.SIGNAL)
    const te1 = perf.now()

    const signalMarkdown = extractionResult?.markdown || ''
    const signalMetadata = extractionResult?.metadata || {
      buttonCount: 0,
      linkCount: 0,
      imageCount: 0,
      wordCount: 0,
      linkToWordRatio: 0,
      paragraphCount: 0,
      listCount: 0
    }

    const tc_start = perf.now()
    const label = await this.classifier.classify(signalMarkdown, signalMetadata)
    const tc_end = perf.now()

    // Pass 2: Semantic Extraction for high-fidelity output
    const ts2 = perf.now()
    let markdown = this.extractor.extract(html, ExtractMode.SEMANTIC) || ''
    const te2 = perf.now()

    const tr_start = perf.now()
    if (this.redactor) {
      markdown = this.redactor.redact(markdown)
    }
    const tr_end = perf.now()

    const t_total = perf.now()

    return {
      markdown,
      label,
      metadata: {
        ...signalMetadata,
        charCount: markdown.length,
      },
      timing: {
        total: t_total - t0,
        extraction_signal: te1 - ts1,
        classification: tc_end - tc_start,
        extraction_semantic: te2 - ts2,
        redaction: tr_end - tr_start,
      }
    }
  }

  /**
   * Only extract markdown without classification. Defaults to SEMANTIC mode.
   */
  public extract(html: string, mode: ExtractMode = ExtractMode.SEMANTIC): string | undefined {
    let markdown = this.extractor.extract(html, mode)
    if (markdown && this.redactor) {
      markdown = this.redactor.redact(markdown)
    }
    return markdown
  }

  /**
   * Only classify text without extraction.
   */
  public async classify(text: string): Promise<string> {
    return this.classifier.classify(text)
  }
}
