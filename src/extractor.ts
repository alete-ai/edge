import { Readability } from '@mozilla/readability'
import {
  convertHtmlToMarkdown as convert,
  type SemanticMarkdownAST,
} from 'dom-to-semantic-markdown'
import { parseHTML } from 'linkedom'

export enum ExtractMode {
  /** Preserves UI markers (buttons, forms, nav) for classification. */
  SIGNAL = 'SIGNAL',
  /** Clean, high-fidelity Markdown optimized for LLM consumption. */
  SEMANTIC = 'SEMANTIC',
}

export interface ExtractorOptions {
  ignoredTags?: string[]
}

export class Extractor {
  private defaultIgnoredTags: Set<string>

  constructor(options: ExtractorOptions = {}) {
    // These are always junk
    this.defaultIgnoredTags = new Set(options.ignoredTags || [
      'script', 'style', 'iframe', 'noscript', 'svg'
    ])
  }

  /**
   * Extracts content from HTML based on the requested mode.
   */
  public extract(html: string, mode: ExtractMode = ExtractMode.SEMANTIC): string | undefined {
    try {
      const { document } = parseHTML(html)

      // Determine which tags to strip based on mode
      const ignoredTags = new Set(this.defaultIgnoredTags)
      if (mode === ExtractMode.SEMANTIC) {
        // Standard high-fidelity stripping
        ;['nav', 'footer', 'header', 'form', 'button', 'img'].forEach((t) => ignoredTags.add(t))
      }

      let htmlToConvert = html
      
      // Pass 1 (Classification Signal): We skip Readability because it's too 
      // aggressive for non-article pages (Dashboards, Logins).
      // Pass 2 (Semantic Delivery): We use Readability for junk removal if mode is SEMANTIC.
      if (mode === ExtractMode.SEMANTIC) {
        try {
          const reader = new Readability(document)
          const article = reader.parse()
          if (article && article.content) {
            htmlToConvert = article.content
          }
        } catch (e) {
          // Fallback to original HTML
        }
      }

      let finalHtml = htmlToConvert
      if (!finalHtml.toLowerCase().includes('<html')) {
        finalHtml = `<html><body>${finalHtml}</body></html>`
      }
      
      const { document: convertDoc } = parseHTML(finalHtml)
      const customParser = new convertDoc.defaultView.DOMParser()

      const markdown = convert(finalHtml, {
        extractMainContent: false, // Managed by Readability or our mode logic
        overrideDOMParser: customParser,
        overrideElementProcessing: (element: Element): SemanticMarkdownAST[] | undefined => {
          const tagName = element.tagName ? element.tagName.toLowerCase() : ''
          const role = element.getAttribute ? element.getAttribute('role') : null

          // Handle ignored tags and ARIA roles
          if (
            ignoredTags.has(tagName) ||
            (mode === ExtractMode.SEMANTIC &&
              (role === 'navigation' || role === 'banner' || role === 'contentinfo'))
          ) {
            return []
          }

          // Signal Mode Special: Preserve UI text markers
          if (mode === ExtractMode.SIGNAL) {
            if (tagName === 'button' || tagName === 'a' || tagName === 'label') {
              return [{ type: 'text', content: `[${element.textContent?.trim() || ''}] ` }]
            }
          } else if (tagName === 'a') {
            // Semantic Mode: Links become plain text to reduce LLM noise
            return [{ type: 'text', content: element.textContent || '' }]
          }

          return undefined
        },
      })

      return markdown
    } catch (error) {
      console.error('[AleteEdge] Failed to convert HTML to Markdown:', error)
      return undefined
    }
  }
}
