import Foundation

public struct StructuralMetadata: Codable {
    public let buttonCount: Int
    public let linkCount: Int
    public let linkToWordRatio: Float
    public let imageCount: Int
    public let paragraphCount: Int
    public let listCount: Int
    
    public init(buttonCount: Int, linkCount: Int, linkToWordRatio: Float, imageCount: Int, paragraphCount: Int, listCount: Int) {
        self.buttonCount = buttonCount
        self.linkCount = linkCount
        self.linkToWordRatio = linkToWordRatio
        self.imageCount = imageCount
        self.paragraphCount = paragraphCount
        self.listCount = listCount
    }
}

public class ContentPreprocessor {
    
    public init() {}
    
    public func generateMetadataTokens(metadata: StructuralMetadata) -> [String] {
        var tokens: [String] = []
        
        if metadata.buttonCount > 10 { tokens.append("__btn_high") }
        else if metadata.buttonCount > 2 { tokens.append("__btn_mid") }
        else if metadata.buttonCount > 0 { tokens.append("__btn_low") }

        if metadata.linkCount > 50 { tokens.append("__lnk_high") }
        else if metadata.linkCount > 10 { tokens.append("__lnk_mid") }
        else if metadata.linkCount > 0 { tokens.append("__lnk_low") }

        if metadata.linkToWordRatio > 0.3 { tokens.append("__ratio_high") }
        else if metadata.linkToWordRatio > 0.1 { tokens.append("__ratio_mid") }
        
        if metadata.imageCount > 10 { tokens.append("__img_high") }
        else if metadata.imageCount > 0 { tokens.append("__img_low") }

        if metadata.paragraphCount > 20 { tokens.append("__para_high") }
        else if metadata.paragraphCount > 5 { tokens.append("__para_mid") }

        if metadata.listCount > 5 { tokens.append("__list_high") }
        else if metadata.listCount > 0 { tokens.append("__list_low") }
        
        return tokens
    }
}
