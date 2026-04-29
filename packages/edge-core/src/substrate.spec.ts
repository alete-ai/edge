import { describe, it, expect } from 'vitest'
import { Extractor } from './extractor.js'
import { ExtractMode } from './types.js'

describe('Substrate Test: Core Package', () => {
  it('should run extraction without any classifier dependencies', async () => {
    const extractor = new Extractor()
    const html = '<html><body><h1>Core Substrate</h1><button>Action</button></body></html>'
    
    // Test STRUCTURAL mode which is used for native classifiers
    const result = await extractor.extractWithMetadata(html, ExtractMode.STRUCTURAL)
    
    expect(result).toBeDefined()
    if (result) {
      expect(result.markdown).toContain('[Action]')
      expect(result.metadata.buttonCount).toBe(1)
    }
    
    // Test SEMANTIC mode
    const markdown = await extractor.extract(html, ExtractMode.SEMANTIC)
    expect(markdown).toContain('Core Substrate')
    expect(markdown).not.toContain('[Action]')
  })
})
