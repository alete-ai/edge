import { Readability } from '@mozilla/readability';
import {
  convertHtmlToMarkdown as convert,
  type SemanticMarkdownAST,
} from 'dom-to-semantic-markdown';
import { parseHTML } from 'linkedom';

export interface ExtractorOptions {
  ignoredTags?: string[];
}

export class Extractor {
  private ignoredTags: Set<string>;

  constructor(options: ExtractorOptions = {}) {
    this.ignoredTags = new Set(options.ignoredTags || [
      'script', 'style', 'nav', 'footer', 'header', 'iframe', 'noscript', 'svg', 'form', 'button', 'img'
    ]);
  }

  public extract(html: string): string | undefined {
    try {
      const { document } = parseHTML(html);

      // Simple extraction for now to unblock
      const body = document.body;
      let text = '';

      const walk = (node: any) => {
        if (node.nodeType === 3) {
          text += node.textContent;
          return;
        }
        const tag = node.tagName?.toLowerCase();
        if (this.ignoredTags.has(tag)) return;

        for (const child of node.childNodes) {
          walk(child);
        }
        if (tag === 'h1' || tag === 'h2' || tag === 'p') {
          text += '\n';
        }
      };

      walk(body);
      return text.trim();
    } catch (error) {
      console.error('[AleteEdge] Failed to convert HTML to Markdown:', error);
      return undefined;
    }
  }
}
