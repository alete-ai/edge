import Foundation

public enum ClassifierLabel: String, CaseIterable, Codable {
    case commercialPromotion = "Commercial:Promotion"
    case creativeProse = "Creative:Prose"
    case educationalInstruction = "Educational:Instruction"
    case functionalApp = "Functional:App"
    case informationalBlog = "Informational:Blog"
    case informationalNews = "Informational:News"
    case informationalResearch = "Informational:Research"
    case otherGeneral = "Other:General"
    case restrictedFinancial = "Restricted:Financial"
    case restrictedHealth = "Restricted:Health"
    case restrictedLegal = "Restricted:Legal"
    case restrictedPII = "Restricted:PII"
    case socialForum = "Social:Forum"
    
    /// Fallback initializer for raw string labels
    public static func from(rawLabel: String) -> ClassifierLabel {
        return ClassifierLabel(rawValue: rawLabel) ?? .otherGeneral
    }
}
