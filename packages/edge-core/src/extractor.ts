import { Readability } from '@mozilla/readability'
import { htmlToMarkdown } from 'mdream'
import { getDOMProvider, type DOMProvider } from './platform/dom.js'
import { ExtractMode, type ExtractorOptions, type StructuralMetadata } from './types.js'

export class Extractor {
  private defaultIgnoredTags: string[]
  private domProvider: DOMProvider | null = null
  private ready: Promise<void>

  constructor(options: ExtractorOptions = {}) {
    // These are always junk
    this.defaultIgnoredTags = options.ignoredTags || [
      'script', 'style', 'iframe', 'noscript', 'svg'
    ]
    this.ready = this.init()
  }

  private async init() {
    this.domProvider = await getDOMProvider()
  }

  /**
   * Extracts content and structural metadata from HTML.
   */
  public async extractWithMetadata(html: string, mode: ExtractMode = ExtractMode.SEMANTIC): Promise<{ markdown: string, metadata: StructuralMetadata } | undefined> {
    await this.ready
    try {
      const { document } = this.domProvider!.parseHTML(html)
      const metadata = this.calculateStructuralMetadata(document)
      const result = await this.extract(html, mode)
      
      if (!result) return undefined

      // If we got a string back, it means we don't have page metadata yet (unlikely with new implementation)
      // but if we got an object, we merge it.
      if (typeof result === 'string') {
        return { markdown: result, metadata }
      }

      return { 
        markdown: result.markdown, 
        metadata: { ...metadata, page: result.pageMetadata } 
      }
    } catch (error) {
      console.error('[AleteEdge] Failed to extract with metadata:', error)
      return undefined
    }
  }

  /**
   * Extracts content from HTML based on the requested mode.
   */
  public async extract(html: string, mode: ExtractMode = ExtractMode.SEMANTIC): Promise<string | { markdown: string, pageMetadata: Record<string, string> } | undefined> {
    await this.ready
    try {
      // Configuration for mdream
      let pageMetadata: Record<string, string> = {}
      const options: any = {
        frontmatter: {
          onExtract: (fm: Record<string, string>) => {
            pageMetadata = fm
          }
        },
      }

      if (mode === ExtractMode.SEMANTIC) {
        // SEMANTIC Mode: Optimize for LLM tokens and clean reading
        options.minimal = true // Enables isolateMain, tailwind stripping, boilerplate removal, and clean URLs
        
        // We still want to ensure our specific ignored tags are handled
        options.filter = {
          exclude: [...this.defaultIgnoredTags, 'nav', 'footer', 'header', 'form', 'button', 'img']
        }
        
        // Custom preference: In semantic mode, we want clean text for links (no markdown URL syntax)
        // minimal: true usually produces [text](url), so we override 'a' if we want plain text.
        options.tagOverrides = {
          a: { enter: '', exit: '' }
        }
        
        // Final conversion
        let markdown = htmlToMarkdown(html, options)
        
        // Fallback for short snippets where isolateMain (part of minimal) might be too aggressive
        if (!markdown || markdown.trim() === '' || markdown.length < 10) {
          options.minimal = false
          options.isolateMain = false
          markdown = htmlToMarkdown(html, options)
        }
        
        return { markdown, pageMetadata }
      } else {
        // STRUCTURAL Mode: Preserve UI markers for classification
        options.minimal = false // Stay away from token reduction here to keep markers
        options.isolateMain = false
        options.filter = {
          exclude: this.defaultIgnoredTags
        }
        // UI Markers for the classifier
        options.tagOverrides = {
          button: { enter: '[', exit: '] ' },
          a: { enter: '[', exit: '] ' },
          label: { enter: '[', exit: '] ' }
        }
        
        const markdown = htmlToMarkdown(html, options)
        return { markdown, pageMetadata }
      }
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
