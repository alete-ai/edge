import Foundation

public struct M2VModelConfig: Codable {
    public let classes: [String]
    public let vocabSize: Int
    public let embeddingDim: Int
    public let zipfWeights: [Double]
    public let head: MLPHeadConfig
    
    enum CodingKeys: String, CodingKey {
        case classes
        case vocabSize = "vocab_size"
        case embeddingDim = "embedding_dim"
        case zipfWeights = "zipf_weights"
        case head
    }
}

public struct MLPHeadConfig: Codable {
    public let hiddenWeights: [[Double]]
    public let hiddenBias: [Double]
    public let outputWeights: [[Double]]
    public let outputBias: [Double]
    
    enum CodingKeys: String, CodingKey {
        case hiddenWeights = "hidden_weights"
        case hiddenBias = "hidden_bias"
        case outputWeights = "output_weights"
        case outputBias = "output_bias"
    }
}

public struct QuantizationMeta: Codable {
    public let count: Int
    public let scale4: Double
    public let min: Double
}
