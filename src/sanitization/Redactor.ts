import { DeepRedact } from '@hackylabs/deep-redact';

export interface RedactorOptions {
  redactPii?: boolean;
  redactFinancials?: boolean;
  redactCredentials?: boolean;
  redactInfrastructure?: boolean;
  customPlaceholders?: Record<string, string>;
}

export class Redactor {
  private redactor: DeepRedact;

  constructor(options: RedactorOptions = {}) {
    const {
      redactPii = true,
      redactFinancials = true,
      redactCredentials = true,
      redactInfrastructure = true,
      customPlaceholders = {},
    } = options;

    const stringTests = [];

    if (redactPii) {
      stringTests.push(
        {
          pattern: /\b[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}\b/g,
          replacer: (v: string, p: RegExp) => v.replace(p, customPlaceholders.EMAIL || '[EMAIL_REDACTED]'),
        },
        {
          pattern: /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
          replacer: (v: string, p: RegExp) => v.replace(p, customPlaceholders.PHONE || '[PHONE_REDACTED]'),
        },
        {
          pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
          replacer: (v: string, p: RegExp) => v.replace(p, customPlaceholders.SSN || '[SSN_REDACTED]'),
        }
      );
    }

    if (redactFinancials) {
      stringTests.push(
        {
          // Refined CC pattern: 13-19 digits with optional single spaces/dashes
          pattern: /\b(?:\d[ -]?){12,18}\d\b/g,
          replacer: (v: string, p: RegExp) => v.replace(p, customPlaceholders.CREDIT_CARD || '[CREDIT_CARD_REDACTED]'),
        },
        {
          pattern: /\b[A-Z]{2}\d{2}[A-Z0-9]{4,30}\b/g,
          replacer: (v: string, p: RegExp) => v.replace(p, customPlaceholders.IBAN || '[IBAN_REDACTED]'),
        }
      );
    }

    if (redactCredentials) {
      stringTests.push(
        {
          pattern: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g,
          replacer: (v: string, p: RegExp) => v.replace(p, customPlaceholders.AWS_KEY || '[AWS_KEY_REDACTED]'),
        },
        {
          pattern: /\beyJ[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\b/g,
          replacer: (v: string, p: RegExp) => v.replace(p, customPlaceholders.JWT || '[JWT_REDACTED]'),
        },
        {
          // Generic API key/secret pattern: key=value or key is value
          pattern: /(?:key|token|secret|password|auth|api)[-._\s]*(?:[:=]|\bis\b)\s*["']?([\w-]{16,})["']?/gi,
          replacer: (v: string, p: RegExp) => {
            return v.replace(p, (match) => {
              const separatorMatch = match.match(/([-._\s]*(?:[:=]|\bis\b)\s*)/i);
              if (separatorMatch) {
                const fullSeparator = separatorMatch[0];
                const keyPart = match.substring(0, match.indexOf(fullSeparator));
                return `${keyPart}${fullSeparator}${customPlaceholders.SECRET || '[SECRET_REDACTED]'}`;
              }
              return customPlaceholders.SECRET || '[SECRET_REDACTED]';
            });
          },
        }
      );
    }

    if (redactInfrastructure) {
      stringTests.push(
        {
          pattern: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g,
          replacer: (v: string, p: RegExp) => v.replace(p, customPlaceholders.IP || '[IP_REDACTED]'),
        },
        {
          pattern: /\b(?:[A-Fa-f0-9]{2}[:-]){5}(?:[A-Fa-f0-9]{2})\b/g,
          replacer: (v: string, p: RegExp) => v.replace(p, customPlaceholders.MAC || '[MAC_REDACTED]'),
        }
      );
    }

    this.redactor = new DeepRedact({
      stringTests,
    });
  }

  /**
   * Redacts sensitive information from the given text.
   */
  public redact(text: string): string {
    return this.redactor.redact(text) as string;
  }
}
