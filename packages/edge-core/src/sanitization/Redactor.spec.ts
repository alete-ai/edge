import { describe, it, expect } from 'vitest';
import { Redactor } from './Redactor.js';

describe('Redactor (Narrative-First Sanitization)', () => {
  const redactor = new Redactor();

  it('should redact email addresses', async () => {
    const input = 'Contact me at john.doe@gmail.com for details.';
    const output = await redactor.redact(input);
    expect(output).toMatch(/\[EMAIL_\d+\]/);
  });

  it('should redact phone numbers', async () => {
    const input = 'Call me at 07700900123';
    const output = await redactor.redact(input);
    expect(output).toMatch(/\[PHONE_UK_\d+\]/);
  });

  it('should redact SSN when context is provided', async () => {
    const input = 'My SSN: 123-45-6789.';
    const output = await redactor.redact(input);
    expect(output).toMatch(/\[SSN_\d+\]/);
  });

  it('should redact medical records', async () => {
    const input = 'Patient MRN-ABC12345 was seen today.';
    const output = await redactor.redact(input);
    expect(output).toMatch(/\[MRN_\d+\]/);
  });

  it('should PRESERVE names and dates (Narrative-First)', async () => {
    const input = 'On Wednesday, May 13, 2026, John Smith met with the team in New York.';
    const output = await redactor.redact(input);
    expect(output).toContain('John Smith');
    expect(output).toContain('Wednesday, May 13, 2026');
    expect(output).toContain('New York');
  });

  it('should provide hasSensitiveInfo flag', async () => {
    const safeText = 'This is a public article about the climate.';
    const sensitiveText = 'My SSN: 123-45-6789';
    
    expect(await redactor.hasSensitiveInfo(safeText)).toBe(false);
    expect(await redactor.hasSensitiveInfo(sensitiveText)).toBe(true);
  });

  it('should process and return both redacted text and flag', async () => {
    const input = 'SSN: 123-45-6789';
    const result = await redactor.process(input);
    expect(result.hasSensitiveInfo).toBe(true);
    expect(result.redacted).toMatch(/\[SSN_\d+\]/);
  });

  it('should allow selective redaction via options', async () => {
    const selectiveRedactor = new Redactor({ redactFinancials: false });
    const input = 'Card: 4111-1111-1111-1111, SSN: 123-45-6789';
    const output = await selectiveRedactor.redact(input);
    
    // Financials should be preserved, Government (SSN) should be redacted
    expect(output).toContain('4111-1111-1111-1111');
    expect(output).toMatch(/\[SSN_\d+\]/);
  });
});
