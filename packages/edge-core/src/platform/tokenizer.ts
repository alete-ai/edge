// Minimal BERT WordPiece tokenizer.
// Implements BertNormalizer → BertPreTokenizer → WordPiece, matching the HF tokenizers spec
// used by the model2vec engine. No ONNX, no workers, no external dependencies.

type NormalizerConfig = {
  lowercase?: boolean
  strip_accents?: boolean | null
  clean_text?: boolean
  handle_chinese_chars?: boolean
}

type ModelConfig = {
  vocab: Record<string, number>
  unk_token?: string
  continuing_subword_prefix?: string
  max_input_chars_per_word?: number
}

export type BertTokenizerConfig = {
  normalizer?: NormalizerConfig
  model: ModelConfig
}

function isWhitespace(cp: number): boolean {
  return cp === 0x20 || cp === 0x09 || cp === 0x0a || cp === 0x0d
}

function isControl(cp: number): boolean {
  // Tab, LF, CR are not treated as control chars in BERT
  if (cp === 0x09 || cp === 0x0a || cp === 0x0d) return false
  return (cp >= 0x00 && cp <= 0x1f) || (cp >= 0x7f && cp <= 0x9f)
}

function isChinese(cp: number): boolean {
  return (
    (cp >= 0x4e00 && cp <= 0x9fff) ||
    (cp >= 0x3400 && cp <= 0x4dbf) ||
    (cp >= 0x20000 && cp <= 0x2a6df) ||
    (cp >= 0x2a700 && cp <= 0x2b73f) ||
    (cp >= 0xf900 && cp <= 0xfaff) ||
    (cp >= 0x2f800 && cp <= 0x2fa1f)
  )
}

function isPunctuation(cp: number): boolean {
  // ASCII punctuation ranges
  if ((cp >= 33 && cp <= 47) || (cp >= 58 && cp <= 64) ||
      (cp >= 91 && cp <= 96) || (cp >= 123 && cp <= 126)) return true
  // Unicode General Punctuation and Supplemental Punctuation blocks
  if (cp >= 0x2000 && cp <= 0x206f) return true
  if (cp >= 0x2e00 && cp <= 0x2e7f) return true
  return false
}

function bertNormalize(text: string, cfg: NormalizerConfig): string {
  const lowercase = cfg.lowercase ?? true
  const cleanText = cfg.clean_text ?? true
  const handleChinese = cfg.handle_chinese_chars ?? true
  // strip_accents=null means "strip if lowercasing"
  const stripAccents = cfg.strip_accents ?? (lowercase ? null : false)

  let out = ''
  for (const ch of text) {
    const cp = ch.codePointAt(0)!
    if (cp === 0 || cp === 0xfffd) continue
    if (cleanText && isControl(cp)) continue
    if (cleanText && isWhitespace(cp)) { out += ' '; continue }
    if (handleChinese && isChinese(cp)) { out += ' ' + ch + ' '; continue }
    out += ch
  }

  if (lowercase) out = out.toLowerCase()

  if (stripAccents === true || (stripAccents === null && lowercase)) {
    out = out.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }

  return out
}

function bertPreTokenize(text: string): string[] {
  const words: string[] = []
  let buf = ''
  for (const ch of text) {
    const cp = ch.codePointAt(0)!
    if (isWhitespace(cp)) {
      if (buf) { words.push(buf); buf = '' }
    } else if (isPunctuation(cp)) {
      if (buf) { words.push(buf); buf = '' }
      words.push(ch)
    } else {
      buf += ch
    }
  }
  if (buf) words.push(buf)
  return words
}

function wordpieceEncode(
  word: string,
  vocab: Record<string, number>,
  unkId: number,
  prefix: string,
  maxLen: number,
): number[] {
  if (word.length > maxLen) return [unkId]

  const ids: number[] = []
  let start = 0

  while (start < word.length) {
    let end = word.length
    let foundId = -1

    while (start < end) {
      const sub = (start === 0 ? '' : prefix) + word.slice(start, end)
      const id = vocab[sub]
      if (id !== undefined) { foundId = id; break }
      end--
    }

    if (foundId === -1) return [unkId]
    ids.push(foundId)
    start = end
  }

  return ids
}

export type BertTokenizerFn = (text: string) => Promise<{ input_ids: number[] }>

export function makeBertTokenizer(config: BertTokenizerConfig): BertTokenizerFn {
  const vocab = config.model.vocab
  const unkId = vocab[config.model.unk_token ?? '[UNK]'] ?? 1
  const prefix = config.model.continuing_subword_prefix ?? '##'
  const maxLen = config.model.max_input_chars_per_word ?? 100
  const normCfg = config.normalizer ?? {}

  return async (text: string) => {
    const normalized = bertNormalize(text, normCfg)
    const words = bertPreTokenize(normalized)
    const input_ids: number[] = []
    for (const word of words) {
      for (const id of wordpieceEncode(word, vocab, unkId, prefix, maxLen)) {
        input_ids.push(id)
      }
    }
    return { input_ids }
  }
}
