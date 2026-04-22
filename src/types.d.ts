declare module 'wink-naive-bayes-text-classifier';
declare module 'wink-nlp';
declare module 'wink-eng-lite-web-model';
declare module '@mozilla/readability';
declare module 'dom-to-semantic-markdown' {
  export type SemanticMarkdownAST = any;
  export function convertHtmlToMarkdown(html: string, options?: any): string;
}
declare module 'linkedom' {
  export function parseHTML(html: string): { document: any };
}
