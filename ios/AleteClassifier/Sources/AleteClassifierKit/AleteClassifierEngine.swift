import Foundation
import Accelerate

public class AleteClassifierEngine {
    private let loader: ModelLoader
    private let tokenizer: AleteBertTokenizer
    private let config: M2VModelConfig
    
    // Persistent storage for weights/biases to ensure BNNS pointers remain valid
    private var hWeights: [Float] = []
    private var hBias: [Float] = []
    private var oWeights: [Float] = []
    private var oBias: [Float] = []
    
    // BNNS filters for the MLP layers
    private var hiddenLayer: BNNSFilter?
    private var outputLayer: BNNSFilter?
    
    public init(loader: ModelLoader, tokenizer: AleteBertTokenizer) throws {
        self.loader = loader
        self.tokenizer = tokenizer
        self.config = loader.config
        
        try setupBNNSLayers()
    }
    
    private func setupBNNSLayers() throws {
        let dim = config.embeddingDim
        let hiddenSize = config.head.hiddenBias.count
        let numClasses = config.classes.count
        
        // 1. Hidden Layer Filter
        // BNNS expects weights in (outputDim, inputDim) order for row-major.
        // Our config has [inputDim][outputDim].
        self.hWeights = [Float](repeating: 0, count: dim * hiddenSize)
        for i in 0..<dim {
            for j in 0..<hiddenSize {
                hWeights[j * dim + i] = Float(config.head.hiddenWeights[i][j])
            }
        }
        self.hBias = config.head.hiddenBias.map { Float($0) }
        
        self.hiddenLayer = try createFullyConnectedLayer(
            inputDim: dim,
            outputDim: hiddenSize,
            weights: &hWeights,
            bias: &hBias,
            activation: .rectifiedLinear
        )
        
        // 2. Output Layer Filter
        self.oWeights = [Float](repeating: 0, count: hiddenSize * numClasses)
        for i in 0..<hiddenSize {
            for j in 0..<numClasses {
                oWeights[j * hiddenSize + i] = Float(config.head.outputWeights[i][j])
            }
        }
        self.oBias = config.head.outputBias.map { Float($0) }
        
        self.outputLayer = try createFullyConnectedLayer(
            inputDim: hiddenSize,
            outputDim: numClasses,
            weights: &oWeights,
            bias: &oBias,
            activation: .identity
        )
    }
    
    private func createFullyConnectedLayer(
        inputDim: Int,
        outputDim: Int,
        weights: UnsafeMutablePointer<Float>,
        bias: UnsafeMutablePointer<Float>,
        activation: BNNSActivationFunction
    ) throws -> BNNSFilter {
        
        let iDesc = BNNSNDArrayDescriptor(
            flags: BNNSNDArrayFlags(0),
            layout: BNNSDataLayoutVector,
            size: (inputDim, 0, 0, 0, 0, 0, 0, 0),
            stride: (0, 0, 0, 0, 0, 0, 0, 0),
            data: nil,
            data_type: .float,
            table_data: nil,
            table_data_type: .float,
            data_scale: 0,
            data_bias: 0
        )
        
        let oDesc = BNNSNDArrayDescriptor(
            flags: BNNSNDArrayFlags(0),
            layout: BNNSDataLayoutVector,
            size: (outputDim, 0, 0, 0, 0, 0, 0, 0),
            stride: (0, 0, 0, 0, 0, 0, 0, 0),
            data: nil,
            data_type: .float,
            table_data: nil,
            table_data_type: .float,
            data_scale: 0,
            data_bias: 0
        )
        
        let wDesc = BNNSNDArrayDescriptor(
            flags: BNNSNDArrayFlags(0),
            layout: BNNSDataLayoutRowMajorMatrix,
            size: (inputDim, outputDim, 0, 0, 0, 0, 0, 0), // cols=inputDim, rows=outputDim
            stride: (0, 0, 0, 0, 0, 0, 0, 0),
            data: weights,
            data_type: .float,
            table_data: nil,
            table_data_type: .float,
            data_scale: 0,
            data_bias: 0
        )
        
        let bDesc = BNNSNDArrayDescriptor(
            flags: BNNSNDArrayFlags(0),
            layout: BNNSDataLayoutVector,
            size: (outputDim, 0, 0, 0, 0, 0, 0, 0),
            stride: (0, 0, 0, 0, 0, 0, 0, 0),
            data: bias,
            data_type: .float,
            table_data: nil,
            table_data_type: .float,
            data_scale: 0,
            data_bias: 0
        )
        
        var params = BNNSLayerParametersFullyConnected(
            i_desc: iDesc,
            w_desc: wDesc,
            o_desc: oDesc,
            bias: bDesc,
            activation: BNNSActivation(function: activation, alpha: 0, beta: 0)
        )
        
        guard let filter = BNNSFilterCreateLayerFullyConnected(&params, nil) else {
            throw ClassifierError.initializationFailed("Failed to create BNNS layer")
        }
        
        return filter
    }
    
    public func classify(_ text: String) -> (label: String, score: Float, all: [String: Float]) {
        let inputIds = tokenizer.tokenize(text)
        
        // 1. Embedding Lookup & Weighted Mean Pooling
        let dim = config.embeddingDim
        var pooled = [Float](repeating: 0, count: dim)
        var totalWeight: Float = 0
        
        for id in inputIds {
            if id <= 4 { continue }
            
            var weight = Float(id < config.zipfWeights.count ? config.zipfWeights[id] : 1.0)
            let offset = id * dim
            
            // pooled = pooled + (embeddings[offset...] * weight)
            loader.embeddings.withUnsafeBufferPointer { embPtr in
                let subEmb = embPtr.baseAddress!.advanced(by: offset)
                vDSP_vsma(subEmb, 1, &weight, pooled, 1, &pooled, 1, vDSP_Length(dim))
            }
            
            totalWeight += weight
        }
        
        if totalWeight > 0 {
            var invWeight = 1.0 / totalWeight
            vDSP_vsmul(pooled, 1, &invWeight, &pooled, 1, vDSP_Length(dim))
        }
        
        // 2. L2 Normalize
        var normSq: Float = 0
        vDSP_svesq(pooled, 1, &normSq, vDSP_Length(dim))
        let n = sqrt(normSq)
        if n > 0 {
            var invNorm = 1.0 / n
            vDSP_vsmul(pooled, 1, &invNorm, &pooled, 1, vDSP_Length(dim))
        }
        
        // 3. MLP Head
        let hiddenSize = config.head.hiddenBias.count
        var hidden = [Float](repeating: 0, count: hiddenSize)
        BNNSFilterApply(hiddenLayer!, pooled, &hidden)
        
        let numClasses = config.classes.count
        var logits = [Float](repeating: 0, count: numClasses)
        BNNSFilterApply(outputLayer!, hidden, &logits)
        
        // 4. Softmax
        let probs = softmax(logits)
        
        var maxScore: Float = -1.0
        var maxIdx = 0
        var all: [String: Float] = [:]
        
        for (idx, prob) in probs.enumerated() {
            let label = config.classes[idx]
            all[label] = prob
            if prob > maxScore {
                maxScore = prob
                maxIdx = idx
            }
        }
        
        return (config.classes[maxIdx], maxScore, all)
    }
    
    private func softmax(_ logits: [Float]) -> [Float] {
        let maxLogit = vDSP.maximum(logits)
        var exps = [Float](repeating: 0, count: logits.count)
        
        // exps = exp(logits - maxLogit)
        var negativeMaxLogit = -maxLogit
        var shiftedLogits = [Float](repeating: 0, count: logits.count)
        vDSP_vsadd(logits, 1, &negativeMaxLogit, &shiftedLogits, 1, vDSP_Length(logits.count))
        
        var count = Int32(logits.count)
        vvexpf(&exps, shiftedLogits, &count)
        
        let sumExps = vDSP.sum(exps)
        var invSum = 1.0 / sumExps
        var result = [Float](repeating: 0, count: exps.count)
        vDSP_vsmul(exps, 1, &invSum, &result, 1, vDSP_Length(exps.count))
        
        return result
    }
    
    deinit {
        if let hl = hiddenLayer { BNNSFilterDestroy(hl) }
        if let ol = outputLayer { BNNSFilterDestroy(ol) }
    }
}
