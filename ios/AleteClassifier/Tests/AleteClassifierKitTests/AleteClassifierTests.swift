import XCTest
@testable import AleteClassifierKit

final class AleteClassifierTests: XCTestCase {
    
    struct ParitySample: Codable {
        let input: String
        let tokens: [Int]
        let label: String
        let score: Float
        let all: [String: Float]
    }
    
    func testTokenization() {
        let vocab = ["[UNK]": 1, "[SEP]": 3, "[CLS]": 2, "hello": 101, "world": 102, "##ly": 103]
        let modelConfig = BertTokenizerConfig.Model(vocab: vocab, unkToken: "[UNK]", continuingSubwordPrefix: "##", maxInputCharsPerWord: 100)
        let config = BertTokenizerConfig(normalizer: nil, model: modelConfig)
        
        let tokenizer = AleteBertTokenizer(config: config)
        let ids = tokenizer.tokenize("Hello worldly!")
        
        XCTAssertTrue(ids.contains(101))
        XCTAssertTrue(ids.contains(102))
        XCTAssertTrue(ids.contains(103))
    }
    
    func testCrossPlatformParity() throws {
        // 1. Load Model Assets from Bundle
        guard let configURL = Bundle.module.url(forResource: "m2v_head", withExtension: "json"),
              let embeddingsURL = Bundle.module.url(forResource: "m2v_embeddings", withExtension: "bin"),
              let metaURL = Bundle.module.url(forResource: "m2v_quant_meta", withExtension: "json"),
              let tokenizerURL = Bundle.module.url(forResource: "tokenizer", withExtension: "json") else {
            XCTFail("Missing model assets in bundle")
            return
        }
        
        let loader = try ModelLoader(configURL: configURL, embeddingsURL: embeddingsURL, metaURL: metaURL)
        
        let tokenizerData = try Data(contentsOf: tokenizerURL)
        let tokenizerConfig = try JSONDecoder().decode(BertTokenizerConfig.self, from: tokenizerData)
        let tokenizer = AleteBertTokenizer(config: tokenizerConfig)
        
        let classifier = try AleteClassifier(modelLoader: loader, tokenizer: tokenizer)
        
        // 2. Load Parity Data
        guard let parityURL = Bundle.module.url(forResource: "parity_data", withExtension: "json") else {
            XCTFail("Missing parity_data.json in bundle")
            return
        }
        
        let parityData = try Data(contentsOf: parityURL)
        let samples = try JSONDecoder().decode([ParitySample].self, from: parityData)
        
        // 3. Run Parity Check
        for sample in samples {
            // Check token parity
            let nativeTokens = tokenizer.tokenize(sample.input)
            XCTAssertEqual(nativeTokens, sample.tokens, "Token mismatch for input: \(sample.input)")
            
            let result = classifier.predictProbabilities(text: sample.input)
            
            // Check label parity
            let nativeLabel = classifier.classify(text: sample.input)
            XCTAssertEqual(nativeLabel, sample.label, "Label mismatch for input: \(sample.input)")
            
            // Check score parity (with small epsilon for float variations)
            if let nativeScore = result[sample.label] {
                XCTAssertTrue(abs(nativeScore - sample.score) < 0.05, "Score drift too high for \(sample.label): \(nativeScore) vs \(sample.score)")
            } else {
                XCTFail("Native result missing expected label: \(sample.label)")
            }
        }
        
        print("Successfully verified parity for \(samples.count) samples.")
    }
    
    func testPerformance() throws {
        guard let configURL = Bundle.module.url(forResource: "m2v_head", withExtension: "json"),
              let embeddingsURL = Bundle.module.url(forResource: "m2v_embeddings", withExtension: "bin"),
              let metaURL = Bundle.module.url(forResource: "m2v_quant_meta", withExtension: "json"),
              let tokenizerURL = Bundle.module.url(forResource: "tokenizer", withExtension: "json") else {
            XCTFail("Missing model assets")
            return
        }
        
        let loader = try ModelLoader(configURL: configURL, embeddingsURL: embeddingsURL, metaURL: metaURL)
        let tokenizerData = try Data(contentsOf: tokenizerURL)
        let tokenizerConfig = try JSONDecoder().decode(BertTokenizerConfig.self, from: tokenizerData)
        let tokenizer = AleteBertTokenizer(config: tokenizerConfig)
        let classifier = try AleteClassifier(modelLoader: loader, tokenizer: tokenizer)
        
        let text = "This is a long article about the discovery of a new planet in a distant galaxy. The planet, named Alete-1, is believed to have liquid water and a breathable atmosphere, making it a prime candidate for future human colonization. Scientists used the latest telescope technology to capture high-resolution images of the planet's surface."
        
        measure {
            _ = classifier.classify(text: text)
        }
    }
}
