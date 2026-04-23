import { Readability } from '@mozilla/readability'
import {
  convertHtmlToMarkdown as convert,
  type SemanticMarkdownAST,
} from 'dom-to-semantic-markdown'
import { parseHTML } from 'linkedom'

export const ExtractMode = {
  /** Preserves UI markers (buttons, forms, nav) for categorization. */
  STRUCTURAL: 'STRUCTURAL',
  /** Clean, high-fidelity Markdown optimized for LLM consumption. */
  SEMANTIC: 'SEMANTIC',
} as const
export type ExtractMode = (typeof ExtractMode)[keyof typeof ExtractMode]

export interface ExtractorOptions {
  ignoredTags?: string[]
}

export interface StructuralMetadata {
  buttonCount: number
  linkCount: number
  imageCount: number
  wordCount: number
  linkToWordRatio: number
  paragraphCount: number
  listCount: number
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
   * Extracts content and structural metadata from HTML.
   */
  public extractWithMetadata(html: string, mode: ExtractMode = ExtractMode.SEMANTIC): { markdown: string, metadata: StructuralMetadata } | undefined {
    try {
      const { document } = parseHTML(html)
      const metadata = this.calculateStructuralMetadata(document)
      const markdown = this.extract(html, mode) || ''
      
      return { markdown, metadata }
    } catch (error) {
      console.error('[AleteEdge] Failed to extract with metadata:', error)
      return undefined
    }
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
      
      // Pass 1 (Categorization Structural): We skip Readability because it's too 
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
      const customParser = new (convertDoc.defaultView?.DOMParser || (globalThis as any).DOMParser)()

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

          // Structural Mode Special: Preserve UI text markers
          if (mode === ExtractMode.STRUCTURAL) {
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

  private calculateStructuralMetadata(document: any): StructuralMetadata {
    if (!document || !document.querySelectorAll) {
      return {
        buttonCount: 0,
        linkCount: 0,
        imageCount: 0,
        wordCount: 0,
        linkToWordRatio: 0,
        paragraphCount: 0,
        listCount: 0
      }
    }
    const buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"]')
    const links = document.querySelectorAll('a')
    const images = document.querySelectorAll('img')
    const paragraphs = document.querySelectorAll('p')
    const lists = document.querySelectorAll('ul, ol')
    
    // Crude word count from text content
    const bodyContent = document.body ? document.body.textContent : (document.documentElement ? document.documentElement.textContent : '')
    const wordCount = (bodyContent || '').split(/\s+/).filter(Boolean).length

    return {
      buttonCount: buttons.length,
      linkCount: links.length,
      imageCount: images.length,
      wordCount,
      linkToWordRatio: wordCount > 0 ? links.length / wordCount : 0,
      paragraphCount: paragraphs.length,
      listCount: lists.length
    }
  }
}
