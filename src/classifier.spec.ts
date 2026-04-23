import { describe, it, expect } from 'vitest'
import { ContentClassifier } from './classifier.js'

describe('ContentClassifier', () => {
  const classifier = new ContentClassifier()

  it('should identify instructional content', async () => {
    const text = 'How to bake a cake. First, preheat the oven to 350 degrees. Mix the flour and eggs.'
    expect(await classifier.classify(text)).toBe('Educational:Instruction')
  })

  it('should identify financial content', async () => {
    const text = 'Your bank statement for checking account 1234. Current balance is $5,000. Recent deposit from Employer.'
    const label = await classifier.classify(text)
    expect(label).toBe('Restricted:Financial')
  })

  it('should identify news content', async () => {
    const text = 'Breaking: The local government announced new zoning laws today after a long debate in the city council.'
    expect(await classifier.classify(text)).toBe('Informational:News')
  })

  it('should identify app/UI content', async () => {
    const text = 'Account Settings Profile Password Change Notifications Privacy Security Logout'
    expect(await classifier.classify(text)).toBe('Functional:App')
  })

  it('should default to Other:General for unknown signals', async () => {
    const text = '...'
    expect(await classifier.classify(text)).toBe('Other:General')
  })
})
