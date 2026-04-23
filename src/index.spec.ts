import { describe, it, expect } from 'vitest'
import { mock, when, instance, anything } from 'ts-mockito'
import { AleteEdge } from './index.js'
import { Extractor, ExtractMode } from './extractor.js'
import { ContentClassifier } from './classifier.js'

describe('AleteEdge (Unified API)', () => {
  it('should coordinate extraction and classification correctly', async () => {
    // 1. Setup mocks
    const mockedExtractor = mock(Extractor)
    const mockedClassifier = mock(ContentClassifier)

    const mockHtml = '<html><body><h1>Mock</h1></body></html>'
    const mockMarkdown = '# Mock content'
    const mockLabel = 'Informational:News'

    when(mockedExtractor.extractWithMetadata(anything(), ExtractMode.STRUCTURAL)).thenReturn({
      markdown: mockMarkdown,
      metadata: {
        buttonCount: 0,
        linkCount: 0,
        imageCount: 0,
        wordCount: 3,
        linkToWordRatio: 0,
        paragraphCount: 0,
        listCount: 0
      }
    })
    when(mockedExtractor.extract(anything(), ExtractMode.SEMANTIC)).thenReturn(mockMarkdown)
    when(mockedClassifier.classify(anything(), anything())).thenResolve(mockLabel)

    // 2. Instantiate with mocked dependencies
    const edge = new AleteEdge({}, {
      extractor: instance(mockedExtractor),
      classifier: instance(mockedClassifier)
    })

    // 3. Execute
    const result = await edge.process(mockHtml)

    // 4. Verify
    expect(result.markdown).toBe(mockMarkdown)
    expect(result.label).toBe(mockLabel)
    expect(result.timing).toBeDefined()
    expect(result.timing?.total).toBeGreaterThan(0)
    expect(result.timing?.categorization).toBeDefined()
    expect(result.timing?.extraction_structural).toBeDefined()
    expect(result.timing?.extraction_semantic).toBeDefined()
    expect(result.timing?.redaction).toBeDefined()
  })

  it('should redact sensitive information in the process pipeline', async () => {
    const mockedExtractor = mock(Extractor)
    const mockedClassifier = mock(ContentClassifier)

    const mockHtml = '<html><body>Email: test@example.com</body></html>'
    const mockMarkdown = 'Email: test@example.com'
    const mockLabel = 'Other:General'

    when(mockedExtractor.extractWithMetadata(anything(), anything())).thenReturn({
      markdown: mockMarkdown,
      metadata: {
        buttonCount: 0,
        linkCount: 0,
        imageCount: 0,
        wordCount: 3,
        linkToWordRatio: 0,
        paragraphCount: 0,
        listCount: 0
      }
    })
    when(mockedExtractor.extract(anything(), anything())).thenReturn(mockMarkdown)
    when(mockedClassifier.classify(anything(), anything())).thenResolve(mockLabel)

    // No redactor option provided: should default to ON
    const edge = new AleteEdge({}, {
      extractor: instance(mockedExtractor),
      classifier: instance(mockedClassifier)
    })

    const result = await edge.process(mockHtml)

    expect(result.markdown).toBe('Email: [EMAIL_REDACTED]')
    expect(result.label).toBe(mockLabel)
  })

  it('should handle extraction failures gracefully', async () => {
    const mockedExtractor = mock(Extractor)
    const mockedClassifier = mock(ContentClassifier)

    when(mockedExtractor.extractWithMetadata(anything(), anything())).thenReturn(undefined)
    when(mockedExtractor.extract(anything(), anything())).thenReturn(undefined)
    when(mockedClassifier.classify(anything(), anything())).thenResolve('Other:General')

    const edge = new AleteEdge({}, {
      extractor: instance(mockedExtractor),
      classifier: instance(mockedClassifier)
    })

    const result = await edge.process('invalid html')

    expect(result.markdown).toBe('')
    expect(result.label).toBe('Other:General')
    expect(result.metadata?.wordCount).toBe(0)
  })
})
