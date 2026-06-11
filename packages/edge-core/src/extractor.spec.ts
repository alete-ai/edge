/** @vitest-environment node */
import { describe, it, expect } from 'vitest';
import { Extractor } from './extractor.js';

describe('Extractor', () => {
  const extractor = new Extractor();

  it('should extract simple HTML to markdown', async () => {
    const html = '<html><body><h1>Test Content</h1></body></html>';
    const result = await extractor.extract(html);
    const markdown = typeof result === 'object' ? result.markdown : result;
    expect(markdown).toContain('Test Content');
  });

  it('should work with Readability-ready HTML', async () => {
    const html = `
      <html>
        <head><title>Test Page</title></head>
        <body>
          <main>
            <h1>Main Title</h1>
            <p>This is the important content that Readability should find.</p>
          </main>
        </body>
      </html>
    `;
    const result = await extractor.extract(html);
    const markdown = typeof result === 'object' ? result.markdown : result;
    expect(markdown).toContain('Main Title');
    expect(markdown).toContain('important content');
  });

  it('should respect ignored tags', async () => {
    const html = '<html><body><h1>Keep Me</h1><nav>Ignore Me</nav></body></html>';
    const result = await extractor.extract(html);
    const markdown = typeof result === 'object' ? result.markdown : result;
    expect(markdown).toContain('Keep Me');
    expect(markdown).not.toContain('Ignore Me');
  });

  it('should unwrap <a> tags but keep the text', async () => {
    const html = '<html><body><p>Click <a href="http://example.com">here</a> to see more.</p></body></html>';
    const result = await extractor.extract(html);
    const markdown = typeof result === 'object' ? result.markdown : result;
    expect(markdown).toContain('Click here to see more.');
    expect(markdown).not.toContain('http://example.com');
  });

  it('should extract page metadata', async () => {
    const html = `
      <html>
        <head>
          <title>Metaphysics of Attention</title>
          <meta name="description" content="A deep dive into cognitive sovereignty.">
        </head>
        <body>
          <p>Own your focus.</p>
        </body>
      </html>
    `;
    const result = await extractor.extract(html);
    expect(typeof result).toBe('object');
    if (typeof result === 'object') {
      expect(result.pageMetadata.title).toBe('Metaphysics of Attention');
      expect(result.pageMetadata.description).toBe('A deep dive into cognitive sovereignty.');
    }
  });
});
