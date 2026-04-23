import { BertTokenizer } from '@huggingface/transformers'

export interface M2VModelConfig {
  classes: string[]
  vocab_size: number
  embedding_dim: number
  zipf_weights: number[]
  head: {
    hidden_weights: number[][]
    hidden_bias: number[]
    output_weights: number[][]
    output_bias: number[]
  }
}

export class Model2VecEngine {
  private tokenizer: any = null
  private embeddings: Float32Array | null = null
  private config: M2VModelConfig | null = null
  private modelPath: string

  constructor(modelPath?: string) {
    // Default model path. In extensions, this should be relative to the extension root.
    this.modelPath = modelPath || 'model'
  }

  private join(...parts: string[]): string {
    return parts.join('/').replace(/\/+/g, '/')
  }

  private async loadAsset(fileName: string, isBinary: boolean = false): Promise<any> {
    let url: string
    const g = globalThis as any
    
    // 1. Resolve Path using globalThis for safer environment detection
    if (g.chrome?.runtime?.getURL) {
      // Chrome/Safari Extension Context
      url = g.chrome.runtime.getURL(this.join(this.modelPath, fileName))
    } else if (g.browser?.runtime?.getURL) {
      // Standard WebExtensions (Firefox/Safari)
      url = g.browser.runtime.getURL(this.join(this.modelPath, fileName))
    } else if (typeof window !== 'undefined' || typeof self !== 'undefined') {
      // Browser/Worker Context - Ensure absolute path from root
      const path = this.join(this.modelPath, fileName)
      url = path.startsWith('/') ? path : `/${path}`
    } else {
      // Node.js Context
      const fs = await import('fs')
      const pathModule = await import('path')
      const { fileURLToPath } = await import('url')
      // Safely handle environments where import.meta might be restricted
      const currentFile = fileURLToPath(import.meta.url)
      const __dirname = pathModule.dirname(currentFile)
      const fullPath = pathModule.join(__dirname, this.modelPath, fileName)
      
      if (isBinary) {
        const buffer = fs.readFileSync(fullPath)
        return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
      } else {
        return JSON.parse(fs.readFileSync(fullPath, 'utf-8'))
      }
    }

    // 2. Fetch for non-Node environments
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Failed to load asset: ${fileName} from ${url}`)
    
    if (isBinary) {
      return await response.arrayBuffer()
    } else {
      return await response.json()
    }
  }

  async init() {
    if (this.tokenizer) return

    // 1. Load Config/Head
    this.config = await this.loadAsset('m2v_head.json')

    // 2. Load Tokenizer
    const tokenizerJson = await this.loadAsset('tokenizer.json')
    this.tokenizer = new BertTokenizer(tokenizerJson, {})

    // 3. Load Embeddings
    const arrayBuffer = await this.loadAsset('m2v_embeddings.bin', true)
    this.embeddings = new Float32Array(arrayBuffer)
  }

  private relu(x: number): number {
    return Math.max(0, x)
  }

  private softmax(logits: number[]): number[] {
    const maxLogit = Math.max(...logits)
    const exps = logits.map(l => Math.exp(l - maxLogit))
    const sumExps = exps.reduce((a, b) => a + b, 0)
    return exps.map(e => e / sumExps)
  }

  async classify(text: string): Promise<{ label: string; score: number; all: Record<string, number> }> {
    await this.init()
    if (!this.tokenizer || !this.embeddings || !this.config) throw new Error('Model not initialized')

    // 1. Tokenize
    const { input_ids } = await this.tokenizer(text)
    const ids = input_ids.data || input_ids

    // 2. Embedding Lookup & Weighted Mean Pooling (SIF-like)
    const dim = this.config.embedding_dim
    const pooled = new Float32Array(dim).fill(0)
    let totalWeight = 0

    for (const id of ids) {
      const idNum = Number(id)
      // Skip special tokens
      if (idNum <= 4) continue

      const weight = this.config.zipf_weights[idNum] || 1.0
      const offset = idNum * dim
      for (let i = 0; i < dim; i++) {
        pooled[i] += this.embeddings[offset + i] * weight
      }
      totalWeight += weight
    }

    if (totalWeight > 0) {
      for (let i = 0; i < dim; i++) pooled[i] /= totalWeight
    }

    // 3. L2 Normalize (Model2Vec standard)
    let norm = 0
    for (let i = 0; i < dim; i++) norm += pooled[i] * pooled[i]
    norm = Math.sqrt(norm)
    if (norm > 0) {
      for (let i = 0; i < dim; i++) pooled[i] /= norm
    }

    // 4. MLP Head
    // Hidden Layer
    const hiddenSize = this.config.head.hidden_bias.length
    const hidden = new Float32Array(hiddenSize)
    for (let j = 0; j < hiddenSize; j++) {
      let sum = this.config.head.hidden_bias[j]
      for (let i = 0; i < dim; i++) {
        sum += pooled[i] * this.config.head.hidden_weights[i][j]
      }
      hidden[j] = this.relu(sum)
    }

    // Output Layer
    const numClasses = this.config.classes.length
    const logits = new Array(numClasses)
    for (let j = 0; j < numClasses; j++) {
      let sum = this.config.head.output_bias[j]
      for (let i = 0; i < hiddenSize; i++) {
        sum += hidden[i] * this.config.head.output_weights[i][j]
      }
      logits[j] = sum
    }

    // 5. Softmax
    const probs = this.softmax(logits)
    const maxIdx = probs.indexOf(Math.max(...probs))

    const all: Record<string, number> = {}
    this.config.classes.forEach((cls, idx) => {
      all[cls] = probs[idx]
    })

    return {
      label: this.config.classes[maxIdx],
      score: probs[maxIdx],
      all
    }
  }
}
