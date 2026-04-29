import Foundation

public class AleteClassifier {
    private let engine: AleteClassifierEngine
    private let preprocessor: ContentPreprocessor
    
    public init(modelLoader: ModelLoader, tokenizer: AleteBertTokenizer) throws {
        self.engine = try AleteClassifierEngine(loader: modelLoader, tokenizer: tokenizer)
        self.preprocessor = ContentPreprocessor()
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
