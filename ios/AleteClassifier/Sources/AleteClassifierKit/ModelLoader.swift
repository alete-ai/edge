import Foundation
import Accelerate

public enum ClassifierError: Error {
    case assetNotFound(String)
    case invalidFormat(String)
    case initializationFailed(String)
}

public class ModelLoader {
    public let config: M2VModelConfig
    public let embeddings: [Float]
    
    public init(configURL: URL, embeddingsURL: URL, metaURL: URL) throws {
        // 1. Load Config
        let configData = try Data(contentsOf: configURL)
        self.config = try JSONDecoder().decode(M2VModelConfig.self, from: configData)
        
        // 2. Load Meta
        let metaData = try Data(contentsOf: metaURL)
        let meta = try JSONDecoder().decode(QuantizationMeta.self, from: metaData)
        
        // 3. Load and Dequantize Embeddings
        let packedData = try Data(contentsOf: embeddingsURL, options: .mappedIfSafe)
        self.embeddings = try ModelLoader.dequantize(packedData, meta: meta)
    }
    
    private static func dequantize(_ data: Data, meta: QuantizationMeta) throws -> [Float] {
        var result = [Float](repeating: 0, count: meta.count)
        let scale = Float(meta.scale4)
        let minVal = Float(meta.min)
        
        data.withUnsafeBytes { (ptr: UnsafeRawBufferPointer) in
            let bytes = ptr.bindMemory(to: UInt8.self)
            for i in stride(from: 0, to: meta.count, by: 2) {
                let byte = bytes[i / 2]
                
                // High nibble
                let val1 = Float((byte >> 4) & 0x0F)
                result[i] = (val1 / scale) + minVal
                
                // Low nibble
                if i + 1 < meta.count {
                    let val2 = Float(byte & 0x0F)
                    result[i + 1] = (val2 / scale) + minVal
                }
            }
        }
        
        return result
    }
}
