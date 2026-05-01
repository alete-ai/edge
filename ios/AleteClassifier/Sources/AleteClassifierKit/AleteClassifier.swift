import Foundation

public class AleteClassifier {
    private let engine: AleteClassifierEngine
    private let preprocessor: ContentPreprocessor
    
    /// The bundle containing the model assets.
    public static var bundle: Bundle {
        #if SWIFT_PACKAGE
        return Bundle.module
        #else
        return Bundle(for: AleteClassifier.self)
        #endif
    }

    public init(modelLoader: ModelLoader, tokenizer: AleteBertTokenizer) throws {
        self.engine = try AleteClassifierEngine(loader: modelLoader, tokenizer: tokenizer)
        self.preprocessor = ContentPreprocessor()
    }

    /**
     * Factory method to load the default Model2Vec model from the package bundle.
     */
    public static func loadDefault() throws -> AleteClassifier {
        let bundle = AleteClassifier.bundle
        
        guard let configURL = bundle.url(forResource: "m2v_head", withExtension: "json"),
              let embeddingsURL = bundle.url(forResource: "m2v_embeddings", withExtension: "bin"),
              let metaURL = bundle.url(forResource: "m2v_quant_meta", withExtension: "json"),
              let tokenizerURL = bundle.url(forResource: "tokenizer", withExtension: "json") else {
            throw ClassifierError.assetNotFound("Default model assets not found in bundle")
        }
        
        let loader = try ModelLoader(configURL: configURL, embeddingsURL: embeddingsURL, metaURL: metaURL)
        
        let tokenizerData = try Data(contentsOf: tokenizerURL)
        let tokenizerConfig = try JSONDecoder().decode(BertTokenizerConfig.self, from: tokenizerData)
        let tokenizer = AleteBertTokenizer(config: tokenizerConfig)
        
        return try AleteClassifier(modelLoader: loader, tokenizer: tokenizer)
    }
    
    /**
     * Classifies text into a genre bucket.
     * Port of ContentClassifier.ts logic.
     */
    public func classify(text: String, metadata: StructuralMetadata? = nil) -> String {
        // In the native version, we focus on the high-performance Model2Vec engine.
        // If we need the Naive Bayes fallback, we can add it later as a second engine.
        
        var fullText = text
        if let meta = metadata {
            let tokens = preprocessor.generateMetadataTokens(metadata: meta)
            // Matching the JS logic: tokens are repeated 5x for weighting
            let metaString = (0..<5).map { _ in tokens.joined(separator: " ") }.joined(separator: " ")
            fullText = metaString + " " + text
        }
        
        let result = engine.classify(fullText)
        return result.label
    }
    
    /**
     * Returns a probability map for all labels.
     */
    public func predictProbabilities(text: String, metadata: StructuralMetadata? = nil) -> [String: Float] {
        var fullText = text
        if let meta = metadata {
            let tokens = preprocessor.generateMetadataTokens(metadata: meta)
            let metaString = (0..<5).map { _ in tokens.joined(separator: " ") }.joined(separator: " ")
            fullText = metaString + " " + text
        }
        
        let result = engine.classify(fullText)
        return result.all
    }
}
