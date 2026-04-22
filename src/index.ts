import { Extractor, type ExtractorOptions } from './extractor.js';
import { ContentClassifier } from './classifier.js';

export interface EdgePulseResult {
  markdown: string;
  label: string;
  metadata?: {
    wordCount: number;
    charCount: number;
  };
}

export class EdgePulse {
  private extractor: Extractor;
  private classifier: ContentClassifier;

  constructor(options: ExtractorOptions = {}, overrides?: { extractor?: Extractor, classifier?: ContentClassifier }) {
    this.extractor = overrides?.extractor || new Extractor(options);
    this.classifier = overrides?.classifier || new ContentClassifier();
  }

  /**
   * Processes a raw HTML string and returns semantic Markdown and a genre label.
   */
  public async process(html: string): Promise<EdgePulseResult> {
    const markdown = this.extractor.extract(html) || '';
    const label = this.classifier.classify(markdown);

    return {
      markdown,
      label,
      metadata: {
        wordCount: markdown.split(/\s+/).filter(Boolean).length,
        charCount: markdown.length,
      },
    };
  }

  /**
   * Only extract markdown without classification.
   */
  public extract(html: string): string | undefined {
    return this.extractor.extract(html);
  }

  /**
   * Only classify text without extraction.
   */
  public classify(text: string): string {
    return this.classifier.classify(text);
  }
}
