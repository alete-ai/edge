import { describe, it, expect } from 'vitest';
import { mock, when, instance, anyString } from 'ts-mockito';
import { EdgePulse } from './index.js';
import { Extractor } from './extractor.js';
import { ContentClassifier } from './classifier.js';

describe('EdgePulse (Unified API)', () => {
  it('should coordinate extraction and classification correctly', async () => {
    // 1. Setup mocks
    const mockedExtractor = mock(Extractor);
    const mockedClassifier = mock(ContentClassifier);

    const mockHtml = '<html><body><h1>Mock</h1></body></html>';
    const mockMarkdown = '# Mock content';
    const mockLabel = 'Informational:News';

    when(mockedExtractor.extract(mockHtml)).thenReturn(mockMarkdown);
    when(mockedClassifier.classify(mockMarkdown)).thenReturn(mockLabel);

    // 2. Instantiate with mocked dependencies
    const pulse = new EdgePulse({}, {
      extractor: instance(mockedExtractor),
      classifier: instance(mockedClassifier)
    });

    // 3. Execute
    const result = await pulse.process(mockHtml);

    // 4. Verify
    expect(result.markdown).toBe(mockMarkdown);
    expect(result.label).toBe(mockLabel);
    expect(result.metadata?.wordCount).toBe(3);
  });

  it('should handle extraction failures gracefully', async () => {
    const mockedExtractor = mock(Extractor);
    const mockedClassifier = mock(ContentClassifier);

    when(mockedExtractor.extract(anyString())).thenReturn(undefined);
    when(mockedClassifier.classify("")).thenReturn("Other:General");

    const pulse = new EdgePulse({}, {
      extractor: instance(mockedExtractor),
      classifier: instance(mockedClassifier)
    });

    const result = await pulse.process("invalid html");

    expect(result.markdown).toBe("");
    expect(result.label).toBe("Other:General");
    expect(result.metadata?.wordCount).toBe(0);
  });
});
