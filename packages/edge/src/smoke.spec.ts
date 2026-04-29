import { describe, it, expect } from 'vitest'
import { AleteEdge } from './index.js'

describe('Smoke Test: Full Package', () => {
  it('should run the full process pipeline with real dependencies', async () => {
    const edge = new AleteEdge()
    const html = '<html><body><h1>Alete Edge</h1><p>This is a test article.</p></body></html>'
    
    const result = await edge.process(html)
    
    expect(result.markdown).toContain('Alete Edge')
    expect(result.label).toBeDefined()
    expect(result.metadata).toBeDefined()
    expect(result.timing).toBeDefined()
  })
})
