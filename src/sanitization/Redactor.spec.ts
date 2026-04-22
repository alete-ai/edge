import { describe, it, expect } from 'vitest';
import { Redactor } from './Redactor.js';

describe('Redactor (Privacy-First Sanitization)', () => {
  const redactor = new Redactor();

  it('should redact email addresses', () => {
    const input = 'Contact me at stoyan@example.com for details.';
    const output = redactor.redact(input);
    expect(output).toBe('Contact me at [EMAIL_REDACTED] for details.');
  });

  it('should redact phone numbers', () => {
    const input = 'Call me at +1 (555) 123-4567 or 555.123.4567';
    const output = redactor.redact(input);
    expect(output).toContain('[PHONE_REDACTED]');
  });

  it('should redact credit card numbers', () => {
    const input = 'My card number is 1234 5678 1234 5678.';
    const output = redactor.redact(input);
    expect(output).toBe('My card number is [CREDIT_CARD_REDACTED].');
  });

  it('should redact SSN', () => {
    const input = 'My SSN is 123-45-6789.';
    const output = redactor.redact(input);
    expect(output).toBe('My SSN is [SSN_REDACTED].');
  });

  it('should redact IBAN', () => {
    const input = 'Transfer to DE89370400440532013000.';
    const output = redactor.redact(input);
    expect(output).toBe('Transfer to [IBAN_REDACTED].');
  });

  it('should redact AWS keys', () => {
    const input = 'AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE';
    const output = redactor.redact(input);
    expect(output).toBe('AWS_ACCESS_KEY_ID=[AWS_KEY_REDACTED]');
  });

  it('should redact generic secrets in key-value pairs', () => {
    const input = 'Your api_key is "abc-def-ghi-jkl-mno" and the password=supersecretpassword';
    const output = redactor.redact(input);
    expect(output).toContain('api_key is [SECRET_REDACTED]');
    expect(output).toContain('password=[SECRET_REDACTED]');
  });

  it('should redact IP addresses', () => {
    const input = 'Connecting to 192.168.1.1...';
    const output = redactor.redact(input);
    expect(output).toBe('Connecting to [IP_REDACTED]...');
  });

  it('should support custom placeholders', () => {
    const customRedactor = new Redactor({
      customPlaceholders: { EMAIL: '[HIDDEN_EMAIL]' }
    });
    const input = 'Email: test@test.com';
    expect(customRedactor.redact(input)).toBe('Email: [HIDDEN_EMAIL]');
  });

  it('should allow disabling categories', () => {
    const selectiveRedactor = new Redactor({ redactPii: false });
    const input = 'Email: test@test.com, IP: 1.1.1.1';
    const output = selectiveRedactor.redact(input);
    expect(output).toContain('test@test.com');
    expect(output).toContain('[IP_REDACTED]');
  });
});
