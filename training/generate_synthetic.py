import json
import os

def generate_synthetic():
    data = []
    
    # Helper to create a sample with metadata
    def add_sample(text, label, metadata_overrides=None, count=1):
        base_metadata = {
            "buttonCount": 0,
            "linkCount": 0,
            "imageCount": 0,
            "wordCount": len(text.split()),
            "linkToWordRatio": 0,
            "paragraphCount": 1,
            "listCount": 0
        }
        if metadata_overrides:
            base_metadata.update(metadata_overrides)
            if base_metadata["wordCount"] > 0:
                base_metadata["linkToWordRatio"] = base_metadata["linkCount"] / base_metadata["wordCount"]
        
        for _ in range(count):
            data.append({
                "text": text,
                "label": label,
                "metadata": base_metadata,
                "source": "synthetic"
            })

    # --- Functional:App ---
    app_samples = [
        "[Account Settings] [Profile] [Password] [Change] [Notifications] [Privacy] [Security] [Two-Factor Authentication] [Linked Accounts] [Delete Account]",
        "[Dashboard] [Overview] [Analytics] [Reports] [Recent Activity] [Notifications] [Real-time Data] [Performance Metrics] [System Status] [Widgets]",
        "[Login] [Username] [Password] [Forgot Password] [Sign Up] [Register] [Create Account] [Verification Code] [Reset Password] [Login Help]",
        "[Admin Panel] [Users] [Permissions] [Roles] [System Logs] [Configurations] [API Keys] [Webhooks] [Server Settings] [Database Management]",
        "[Checkout] [Cart] [Shipping Address] [Payment Method] [Order Review] [Promo Code] [Gift Card] [Total] [Subtotal] [Taxes] [Shipping Cost]",
        "[Email Address] [Username] [Password] [Sign In] [Log In] [Create Account] [Reset] [Submit] [Cancel] [Next] [Back] [Finish]",
        "[Search...] [Enter your query] [Filter by] [Sort by] [Clear Filters] [Apply]",
        "[My Account] [Settings] [Sign Out] [Log Out] [Profile Settings] [Security Settings] [Privacy Policy] [Terms of Service]"
    ]
    for s in app_samples:
        add_sample(s, "Functional:App", {"buttonCount": 15, "linkCount": 8, "listCount": 3}, count=200)

    # --- Restricted:Financial ---
    financial_samples = [
        "[Bank Statement] [Checking Account] [Savings] [Balance] [Transaction History] [Deposit] [Withdrawal] [Pending Transactions] [Interest Earned]",
        "[Credit Card Statement] [Current Balance] [Minimum Payment] [Due Date] [Available Credit] [Reward Points] [Statement Date] [Recent Transactions]",
        "[Transfer Funds] [Internal] [External] [Wire Transfer] [Schedule Payment] [Bill Pay] [Payee Name] [Account Number] [Routing Number]",
        "[Investment Portfolio] [Stocks] [Bonds] [Mutual Funds] [Market Value] [Capital Gains] [Unrealized Profit Loss] [Asset Allocation] [Dividends]",
        "[Loan Application] [Mortgage] [Interest Rate] [APR] [Term] [Monthly Payment] [Principal] [Insurance] [Escrow] [Loan Officer] [Approval Status]",
        "[Trading Platform] [Buy] [Sell] [Limit Order] [Market Order] [Execution] [Stop Loss] [Take Profit] [Candlestick Chart] [Technical Analysis]"
    ]
    for s in financial_samples:
        add_sample(s, "Restricted:Financial", {"buttonCount": 5, "linkCount": 10, "paragraphCount": 3}, count=100)

    # --- Social:Forum ---
    forum_samples = [
        "I have a problem with my code. [Reply] [Quote] [Report] [Upvote] [Downvote] [Share]",
        "What is the best way to learn TypeScript? [Comment] [Follow Thread] [Mark as Solution]",
        "Check out this new framework! [Link] [External] [Discussion] [User Profile]",
        "User123: Has anyone tried the new update? [Like] [Report]",
        "Moderator: Please stay on topic. [Lock Thread] [Sticky]"
    ]
    for s in forum_samples:
        add_sample(s, "Social:Forum", {"linkCount": 60, "listCount": 15, "buttonCount": 10}, count=150)

    # --- Informational:Blog ---
    blog_samples = [
        "In this post, we will explore the benefits of meditation. [Continue Reading] [Comments] [Share on Twitter]",
        "My journey through Japan: A 10-day itinerary. [Gallery] [Map] [Contact Me]",
        "Why I switched to a minimalist lifestyle. [Related Posts] [Subscribe]",
        "Top 10 productivity hacks for remote workers. [Infographic] [Newsletter]",
        "Review: The latest mirrorless camera from Sony. [Verdict] [Buy Now]",
        "How to cook the perfect sourdough bread. [Step-by-step] [Video]",
        "Personal growth in the age of AI. [Thoughts] [Discussion]"
    ]
    for s in blog_samples:
        add_sample(s, "Informational:Blog", {"paragraphCount": 15, "linkCount": 15, "wordCount": 800}, count=150)

    # --- Informational:News ---
    news_samples = [
        "Breaking: Major breakthrough in fusion energy. [Live Updates] [Politics] [World News]",
        "Stock market reaches record high amid economic optimism. [Finance] [Markets] [Business]",
        "Local community celebrates annual festival. [Lifestyle] [Events] [Photos]",
        "Election results: New government promises reform. [Analysis] [Polls]",
        "Sports: Home team wins championship in dramatic finish. [Stats] [Highlights]",
        "Weather Alert: Severe storm approaching coastal regions. [Emergency Info]",
        "Technology: New smartphone features AI-integrated camera. [Tech News]"
    ]
    for s in news_samples:
        add_sample(s, "Informational:News", {"paragraphCount": 25, "linkCount": 40, "wordCount": 1200}, count=150)

    # --- Informational:Research ---
    research_samples = [
        "Abstract: This study investigates the impact of quantum computing on cryptography. [Methodology] [Results] [Discussion] [References]",
        "The molecular mechanisms of DNA replication involve complex protein interactions. [Introduction] [Figures] [Citations]",
        "Analysis of climate change patterns using multi-decadal satellite data. [Abstract] [Conclusion] [Data Availability]",
        "Neural network architectures for edge computing devices: A survey. [Paper] [PDF] [BibTeX]",
        "Historical analysis of the Silk Road and its economic implications. [Keywords] [Academic Journal]"
    ]
    for s in research_samples:
        add_sample(s, "Informational:Research", {"paragraphCount": 40, "linkCount": 30, "wordCount": 3000, "listCount": 5}, count=100)

    # --- Educational:Instruction ---
    instruction_samples = [
        "How to build a birdhouse in 5 easy steps. [Materials] [Tools] [Step 1]",
        "Tutorial: Getting started with React and TypeScript. [Prerequisites] [Code Examples]",
        "Recipe: Traditional Italian lasagna from scratch. [Ingredients] [Instructions]",
        "Guide to changing a flat tire safely. [Safety Tips] [Video Tutorial]",
        "Learning Python: A comprehensive guide for beginners. [Quiz] [Practice Exercises]"
    ]
    for s in instruction_samples:
        add_sample(s, "Educational:Instruction", {"listCount": 10, "paragraphCount": 15, "wordCount": 1000}, count=100)


    # --- Other:General ---
    general_samples = [
        "Hello world! This is a simple page.",
        "Today is a beautiful day. I am just testing some things.",
        "Welcome to my homepage. There is not much here yet.",
        "Under construction. Please check back later.",
        "Generic content for a generic page. [Home] [About] [Contact]"
    ]
    for s in general_samples:
        add_sample(s, "Other:General", {"wordCount": 50, "linkCount": 2, "paragraphCount": 2}, count=100)


    # --- Restricted:Legal ---
    legal_samples = [
        "Privacy Policy. This policy describes how we collect and use your personal information. [Terms of Service] [Cookie Policy]",
        "User Agreement. By using our service, you agree to the following terms. [Accept] [Decline]",
        "License Agreement. END USER LICENSE AGREEMENT (EULA). [Print] [Download]"
    ]
    for s in legal_samples:
        add_sample(s, "Restricted:Legal", {"paragraphCount": 50, "linkCount": 20, "wordCount": 2000, "buttonCount": 2}, count=50)

    # --- Restricted:PII ---
    pii_samples = [
        "[Personal Profile] [First Name] [Last Name] [Date of Birth] [Social Security Number] [Gender]",
        "[Contact Information] [Email Address] [Phone Number] [Mailing Address]",
        "[Credit Card Number] [CVV] [Expiration Date] [Cardholder Name] [Billing Address]",
        "[Tax ID] [Social Security] [National ID] [Passport] [ID Number]",
        "Residential address street city state zip code postal country",
        "Phone number mobile cell home office extension",
        "Date of birth DOB age place of birth mother's maiden name",
        "Employee record salary history background check clearance level",
        "Medical record number patient ID insurance policy group number"
    ]
    for s in pii_samples:
        add_sample(s, "Restricted:PII", {"buttonCount": 15, "linkCount": 2, "wordCount": 50}, count=200)


    # --- Commercial:Promotion ---
    promo_samples = [
        "Get 50% off today! Limited time offer. [Shop Now] [Add to Cart] [Special Deal]",
        "The best solution for your business. [Try for Free] [Contact Sales] [Watch Demo]",
        "Join 1 million users already using our platform. [Sign Up] [Learn More]"
    ]
    for s in promo_samples:
        add_sample(s, "Commercial:Promotion", {"buttonCount": 20, "linkCount": 30, "imageCount": 15, "wordCount": 300}, count=80)

    output_path = os.path.join(os.path.dirname(__file__), "synthetic.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"Generated {len(data)} synthetic samples with metadata to {output_path}")

if __name__ == "__main__":
    generate_synthetic()
