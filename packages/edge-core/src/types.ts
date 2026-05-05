export const ExtractMode = {
  /** Preserves UI markers (buttons, forms, nav) for categorization. */
  STRUCTURAL: 'STRUCTURAL',
  /** Clean, high-fidelity Markdown optimized for LLM consumption. */
  SEMANTIC: 'SEMANTIC',
} as const
export type ExtractMode = (typeof ExtractMode)[keyof typeof ExtractMode]

export const ClassifierLabel = {
  COMMERCIAL_PROMOTION: 'Commercial:Promotion',
  CREATIVE_PROSE: 'Creative:Prose',
  EDUCATIONAL_INSTRUCTION: 'Educational:Instruction',
  FUNCTIONAL_APP: 'Functional:App',
  INFORMATIONAL_BLOG: 'Informational:Blog',
  INFORMATIONAL_NEWS: 'Informational:News',
  INFORMATIONAL_RESEARCH: 'Informational:Research',
  OTHER_GENERAL: 'Other:General',
  RESTRICTED_FINANCIAL: 'Restricted:Financial',
  RESTRICTED_HEALTH: 'Restricted:Health',
  RESTRICTED_LEGAL: 'Restricted:Legal',
  RESTRICTED_PII: 'Restricted:PII',
  SOCIAL_FORUM: 'Social:Forum',
} as const
export type ClassifierLabel = (typeof ClassifierLabel)[keyof typeof ClassifierLabel]

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
  label: ClassifierLabel | string
  metadata?: StructuralMetadata & {
    charCount: number
  }
  timing?: AleteEdgeTiming
}
