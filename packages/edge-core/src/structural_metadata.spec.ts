/** @vitest-environment node */
import { describe, it, expect } from 'vitest';
import { Extractor } from './extractor.js';
import { ExtractMode } from './types.js';

describe('Extractor Structural Metadata', () => {
  const extractor = new Extractor();

  it('should extract metadata from HTML', async () => {
    const html = `
      <html>
        <body>
          <p>This is a paragraph with some words.</p>
          <p>Another paragraph.</p>
          <a href="#">Link 1</a>
          <a href="#">Link 2</a>
          <button>Click Me</button>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
          <img src="test.jpg" />
        </body>
      </html>
    `;
    const result = await extractor.extractWithMetadata(html, ExtractMode.STRUCTURAL);
    expect(result).toBeDefined();
    if (result) {
      expect(result.metadata.paragraphCount).toBe(2);
      expect(result.metadata.linkCount).toBe(2);
      expect(result.metadata.buttonCount).toBe(1);
      expect(result.metadata.listCount).toBe(1);
      expect(result.metadata.imageCount).toBe(1);
      expect(result.metadata.wordCount).toBeGreaterThan(5);
    }
  });

  it('should calculate linkToWordRatio correctly', async () => {
    const html = `
      <html>
        <body>
          <p>Word word word word word.</p>
          <a href="#">Link</a>
        </body>
      </html>
    `;
    const result = await extractor.extractWithMetadata(html);
    expect(result).toBeDefined();
    if (result) {
      // 6 words approx, 1 link
      expect(result.metadata.linkToWordRatio).toBeGreaterThan(0);
      expect(result.metadata.linkToWordRatio).toBeLessThan(1);
    }
  });
});
