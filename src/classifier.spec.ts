import { describe, it, expect } from 'vitest';
import { ContentClassifier } from './classifier.js';

describe('ContentClassifier (Pulse)', () => {
  const classifier = new ContentClassifier();

  it('should identify instructional content', () => {
    const text = "How to bake a cake. First, preheat the oven to 350 degrees. Mix the flour and eggs.";
    expect(classifier.classify(text)).toBe('Educational:Instruction');
  });

  it('should identify financial content', () => {
    const text = "Your bank statement for checking account 1234. Current balance is $5,000. Recent deposit from Employer.";
    const label = classifier.classify(text);
    expect(label).toBe('Restricted:Financial');
  });

  it('should identify news content', () => {
    const text = "Breaking: The local government announced new zoning laws today after a long debate in the city council.";
    expect(classifier.classify(text)).toBe('Informational:News');
  });

  it('should identify app/UI content', () => {
    const text = "Account Settings Profile Password Change Notifications Privacy Security Logout";
    expect(classifier.classify(text)).toBe('Functional:App');
  });

  it('should default to Other:General for unknown signals', () => {
    const text = "asdf qwerty 123456";
    expect(classifier.classify(text)).toBe('Other:General');
  });
});
