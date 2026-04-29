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

export interface RedactorOptions {
  redactPii?: boolean;
  redactFinancials?: boolean;
  redactCredentials?: boolean;
  redactInfrastructure?: boolean;
  customPlaceholders?: Record<string, string>;
}

export interface AleteEdgeOptions extends ExtractorOptions {
  redactor?: RedactorOptions | boolean
  modelPath?: string
}

export interface AleteEdgeTiming {
  total: number
  extraction_structural: number
  categorization: number
  extraction_semantic: number
  redaction: number
}

export interface AleteEdgeResult {
  markdown: string
  label: string
  metadata?: StructuralMetadata & {
    charCount: number
  }
  timing?: AleteEdgeTiming
}
