import Foundation

public struct BertTokenizerConfig: Codable {
    public struct Normalizer: Codable {
        public let lowercase: Bool?
        public let stripAccents: Bool?
        public let cleanText: Bool?
        public let handleChineseChars: Bool?
        
        enum CodingKeys: String, CodingKey {
            case lowercase
            case stripAccents = "strip_accents"
            case cleanText = "clean_text"
            case handleChineseChars = "handle_chinese_chars"
        }
    }
    
    public struct Model: Codable {
        public let vocab: [String: Int]
        public let unkToken: String?
        public let continuingSubwordPrefix: String?
        public let maxInputCharsPerWord: Int?
        
        enum CodingKeys: String, CodingKey {
            case vocab
            case unkToken = "unk_token"
            case continuingSubwordPrefix = "continuing_subword_prefix"
            case maxInputCharsPerWord = "max_input_chars_per_word"
        }
    }
    
    public let normalizer: Normalizer?
    public let model: Model
}

public class AleteBertTokenizer {
    private let config: BertTokenizerConfig
    private let unkId: Int
    private let prefix: String
    private let maxLen: Int
    
    public init(config: BertTokenizerConfig) {
        self.config = config
        self.unkId = config.model.vocab[config.model.unkToken ?? "[UNK]"] ?? 1
        self.prefix = config.model.continuingSubwordPrefix ?? "##"
        self.maxLen = config.model.maxInputCharsPerWord ?? 100
    }
    
    public func tokenize(_ text: String) -> [Int] {
        let normalized = normalize(text)
        let words = preTokenize(normalized)
        var inputIds: [Int] = []
        
        for word in words {
            inputIds.append(contentsOf: wordpieceEncode(word))
        }
        
        return inputIds
    }
    
    private func normalize(_ text: String) -> String {
        let lowercase = config.normalizer?.lowercase ?? true
        let cleanText = config.normalizer?.cleanText ?? true
        let handleChinese = config.normalizer?.handleChineseChars ?? true
        let stripAccents = config.normalizer?.stripAccents ?? (lowercase ? true : false)
        
        var out = ""
        for char in text {
            guard let cp = char.unicodeScalars.first?.value else { continue }
            if cp == 0 || cp == 0xfffd { continue }
            if cleanText && isControl(cp) { continue }
            if cleanText && isWhitespace(cp) {
                out.append(" ")
                continue
            }
            if handleChinese && isChinese(cp) {
                out.append(" ")
                out.append(char)
                out.append(" ")
                continue
            }
            out.append(char)
        }
        
        if lowercase {
            out = out.lowercased()
        }
        
        if stripAccents {
            out = out.folding(options: .diacriticInsensitive, locale: .current)
        }
        
        return out
    }
    
    private func preTokenize(_ text: String) -> [String] {
        var words: [String] = []
        var buf = ""
        
        for char in text {
            guard let cp = char.unicodeScalars.first?.value else { continue }
            if isWhitespace(cp) {
                if !buf.isEmpty {
                    words.append(buf)
                    buf = ""
                }
            } else if isPunctuation(cp) {
                if !buf.isEmpty {
                    words.append(buf)
                    buf = ""
                }
                words.append(String(char))
            } else {
                buf.append(char)
            }
        }
        
        if !buf.isEmpty {
            words.append(buf)
        }
        
        return words
    }
    
    private func wordpieceEncode(_ word: String) -> [Int] {
        if word.count > maxLen { return [unkId] }
        
        var ids: [Int] = []
        var start = 0
        let chars = Array(word)
        
        while start < chars.count {
            var end = chars.count
            var foundId: Int? = nil
            
            while start < end {
                let subword = String(chars[start..<end])
                let lookup = (start == 0) ? subword : prefix + subword
                if let id = config.model.vocab[lookup] {
                    foundId = id
                    break
                }
                end -= 1
            }
            
            guard let id = foundId else {
                return [unkId]
            }
            
            ids.append(id)
            start = end
        }
        
        return ids
    }
    
    // MARK: - Helpers (Matching BertTokenizer.ts)
    
    private func isWhitespace(_ cp: UInt32) -> Bool {
        return cp == 0x20 || cp == 0x09 || cp == 0x0a || cp == 0x0d
    }
    
    private func isControl(_ cp: UInt32) -> Bool {
        if cp == 0x09 || cp == 0x0a || cp == 0x0d { return false }
        return (cp >= 0x00 && cp <= 0x1f) || (cp >= 0x7f && cp <= 0x9f)
    }
    
    private func isChinese(_ cp: UInt32) -> Bool {
        return (cp >= 0x4e00 && cp <= 0x9fff) ||
               (cp >= 0x3400 && cp <= 0x4dbf) ||
               (cp >= 0x20000 && cp <= 0x2a6df) ||
               (cp >= 0x2a700 && cp <= 0x2b73f) ||
               (cp >= 0xf900 && cp <= 0xfaff) ||
               (cp >= 0x2f800 && cp <= 0x2fa1f)
    }
    
    private func isPunctuation(_ cp: UInt32) -> Bool {
        if (cp >= 33 && cp <= 47) || (cp >= 58 && cp <= 64) ||
           (cp >= 91 && cp <= 96) || (cp >= 123 && cp <= 126) { return true }
        if cp >= 0x2000 && cp <= 0x206f { return true }
        if cp >= 0x2e00 && cp <= 0x2e7f { return true }
        return false
    }
}
