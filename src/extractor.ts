import { Readability } from '@mozilla/readability'
import {
  convertHtmlToMarkdown as convert,
  type SemanticMarkdownAST,
} from 'dom-to-semantic-markdown'
import { parseHTML } from 'linkedom'

export interface ExtractorOptions {
  ignoredTags?: string[]
}

export class Extractor {
  private ignoredTags: Set<string>

  constructor(options: ExtractorOptions = {}) {
    this.ignoredTags = new Set(options.ignoredTags || [
      'script', 'style', 'nav', 'footer', 'header', 'iframe', 'noscript', 'svg', 'form', 'button', 'img'
    ])
  }

  public extract(html: string): string | undefined {
    try {
      const { document } = parseHTML(html)

      // Extract main content using Mozilla Readability
      let htmlToConvert = html
      try {
        const reader = new Readability(document)
        const article = reader.parse()
        if (article && article.content) {
          htmlToConvert = article.content
        }
      } catch (e) {
        // Fallback to original HTML
      }

      // We re-parse because Readability might have modified the document 
      // or we want a fresh start for the converter.
      let finalHtml = htmlToConvert
      if (!finalHtml.toLowerCase().includes('<html')) {
        finalHtml = `<html><body>${finalHtml}</body></html>`
      }
      const { document: convertDoc } = parseHTML(finalHtml)

      // Provide the DOMParser from linkedom to the converter
      // @ts-expect-error - types slightly differ
      const customParser = new convertDoc.defaultView.DOMParser()

      const markdown = convert(finalHtml, {
        extractMainContent: false, // We use Readability or manual cleanup
        overrideDOMParser: customParser,
        overrideElementProcessing: (element: Element): SemanticMarkdownAST[] | undefined => {
          const tagName = element.tagName ? element.tagName.toLowerCase() : ''
          const role = element.getAttribute ? element.getAttribute('role') : null

          if (
            this.ignoredTags.has(tagName) ||
            role === 'navigation' ||
            role === 'banner' ||
            role === 'contentinfo'
          ) {
            return []
          }

          if (tagName === 'a') {
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
