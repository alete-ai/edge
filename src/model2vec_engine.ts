import { BertTokenizer } from '@huggingface/transformers'

// Import assets directly. tsup/esbuild will bundle them.
// JSONs are bundled as objects, .bin is bundled as a data URL (base64) via tsup config.
import m2vHead from './model/m2v_head.json' with { type: 'json' }
import tokenizerJson from './model/tokenizer.json' with { type: 'json' }
// import m2vEmbeddingsData from './model/m2v_embeddings.bin' <-- Removed to allow dynamic swap

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

  constructor(_modelPath?: string) {
    // modelPath ignored as we use zero-config bundled assets
  }

  async init() {
    if (this.tokenizer) return

    // 1. Load Config/Head
    this.config = m2vHead as unknown as M2VModelConfig

    // 2. Load Tokenizer
    this.tokenizer = new BertTokenizer(tokenizerJson, {})

    // 3. Load Embeddings (Always Int4 for optimized footprint)
    const arrayBuffer = await this.loadBinaryAsset('m2v_embeddings.bin');
    const meta = await this.loadJsonAsset('m2v_quant_meta.json');
    
    const i4Packed = new Uint8Array(arrayBuffer);
    this.embeddings = new Float32Array(meta.count);
    for (let i = 0; i < meta.count; i += 2) {
      const byte = i4Packed[i / 2];
      const val1 = (byte >> 4) & 0x0F;
      const val2 = byte & 0x0F;
      
      this.embeddings[i] = (val1 / meta.scale4) + meta.min;
      if (i + 1 < meta.count) {
        this.embeddings[i + 1] = (val2 / meta.scale4) + meta.min;
      }
    }
  }

  private async loadJsonAsset(fileName: string): Promise<any> {
    const isNode = typeof process !== 'undefined' && process.versions?.node;
    if (isNode) {
       const fs = await import('fs');
       const path = await import('path');
       const { fileURLToPath } = await import('url');
       const __dirname = path.dirname(fileURLToPath(import.meta.url));
       let p = path.resolve(__dirname, 'model', fileName);
       if (!fs.existsSync(p)) p = path.resolve(__dirname, fileName);
       return JSON.parse(fs.readFileSync(p, 'utf-8'));
    }
    const response = await fetch(`/model/${fileName}`);
    return await response.json();
  }

  private async loadBinaryAsset(fileName: string): Promise<ArrayBuffer> {
    const isNode = typeof process !== 'undefined' && process.versions?.node;
    
    if (isNode) {
      const fs = await import('fs');
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      
      let fullPath: string;
      try {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        fullPath = path.resolve(__dirname, 'model', fileName);
        
        // Handle dist context
        if (!fs.existsSync(fullPath)) {
           fullPath = path.resolve(__dirname, fileName);
        }
      } catch (e) {
        fullPath = path.resolve(process.cwd(), 'src/model', fileName);
      }
      
      if (!fs.existsSync(fullPath)) {
        throw new Error(`Binary asset ${fileName} not found at ${fullPath}`);
      }

      const buffer = fs.readFileSync(fullPath);
      return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    }

    // Browser/Extension context
    const g = globalThis as any;
    let url: string;
    
    if (g.chrome?.runtime?.getURL) {
      url = g.chrome.runtime.getURL(`model/${fileName}`);
    } else if (g.browser?.runtime?.getURL) {
      url = g.browser.runtime.getURL(`model/${fileName}`);
    } else {
      url = `/model/${fileName}`;
    }

    const response = await fetch(url);
    return await response.arrayBuffer();
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
