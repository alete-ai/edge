import { Extractor, type ExtractorOptions } from './extractor.js'
import { ContentClassifier } from './classifier.js'
import { Redactor, type RedactorOptions } from './sanitization/Redactor.js'

export interface AleteEdgeOptions extends ExtractorOptions {
  redactor?: RedactorOptions | boolean
}

export interface AleteEdgeResult {
  markdown: string
  label: string
  metadata?: {
    wordCount: number
    charCount: number
  }
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
   */
  public async process(html: string): Promise<AleteEdgeResult> {
    let markdown = this.extractor.extract(html) || ''
    const label = this.classifier.classify(markdown)

    if (this.redactor) {
      markdown = this.redactor.redact(markdown)
    }

    return {
      markdown,
      label,
      metadata: {
        wordCount: markdown.split(/\s+/).filter(Boolean).length,
        charCount: markdown.length,
      },
    }
  }

  /**
   * Only extract markdown without classification.
   */
  public extract(html: string): string | undefined {
    let markdown = this.extractor.extract(html)
    if (markdown && this.redactor) {
      markdown = this.redactor.redact(markdown)
    }
    return markdown
  }

  /**
   * Only classify text without extraction.
   */
  public classify(text: string): string {
    return this.classifier.classify(text)
  }
}
