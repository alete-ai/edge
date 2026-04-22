import json
import os

def generate_synthetic():
    data = []
    
    # --- Functional:App ---
    # We increase the weight of App/Login signals significantly
    app_samples = [
        "[Account Settings] [Profile] [Password] [Change] [Notifications] [Privacy] [Security] [Two-Factor Authentication] [Linked Accounts] [Delete Account]",
        "[Dashboard] [Overview] [Analytics] [Reports] [Recent Activity] [Notifications] [Real-time Data] [Performance Metrics] [System Status] [Widgets]",
        "[Settings] [Preferences] [Language] [Theme] [Dark Mode] [Font Size] [Accessibility] [Keyboard Shortcuts] [Data Usage] [Sync Settings]",
        "[Login] [Username] [Password] [Forgot Password] [Sign Up] [Register] [Create Account] [Verification Code] [Reset Password] [Login Help]",
        "[Inbox] [Sent] [Drafts] [Trash] [Spam] [Archive] [Folders] [Mark as Read] [Compose Email] [Reply All] [Forward] [Attachment] [Search Mail]",
        "[Admin Panel] [Users] [Permissions] [Roles] [System Logs] [Configurations] [API Keys] [Webhooks] [Server Settings] [Database Management]",
        "[Workspace] [Projects] [Tasks] [Calendar] [Documents] [Files] [Shared with Me] [Recent Files] [Starred Items] [Trash] [Storage Limit]",
        "[Checkout] [Cart] [Shipping Address] [Payment Method] [Order Review] [Promo Code] [Gift Card] [Total] [Subtotal] [Taxes] [Shipping Cost]",
        "[Search Results] [Filter] [Sort] [Grid] [List View] [Pagination] [Results Per Page] [Advanced Search] [Saved Searches]",
        "[Help Center] [FAQ] [Support] [Documentation] [Tutorials] [API Reference] [Contact Us] [Community Forum] [Knowledge Base] [Status Page]",
        # Add common UI labels/placeholders
        "[Email Address] [Username] [Password] [Sign In] [Log In] [Create Account] [Reset] [Submit] [Cancel] [Next] [Back] [Finish]",
        "[Search...] [Enter your query] [Filter by] [Sort by] [Clear Filters] [Apply]",
        "[My Account] [Settings] [Sign Out] [Log Out] [Profile Settings] [Security Settings] [Privacy Policy] [Terms of Service]"
    ]
    for s in app_samples:
        for _ in range(80): # ~1000 samples total
            data.append({"text": s, "label": "Functional:App"})

    # --- Restricted:Financial ---
    # We add brackets to simulate UI-captured financial data (Dashboards)
    financial_samples = [
        "[Bank Statement] [Checking Account] [Savings] [Balance] [Transaction History] [Deposit] [Withdrawal] [Pending Transactions] [Interest Earned]",
        "[Credit Card Statement] [Current Balance] [Minimum Payment] [Due Date] [Available Credit] [Reward Points] [Statement Date] [Recent Transactions]",
        "[Transfer Funds] [Internal] [External] [Wire Transfer] [Schedule Payment] [Bill Pay] [Payee Name] [Account Number] [Routing Number]",
        "[Investment Portfolio] [Stocks] [Bonds] [Mutual Funds] [Market Value] [Capital Gains] [Unrealized Profit Loss] [Asset Allocation] [Dividends]",
        "[Loan Application] [Mortgage] [Interest Rate] [APR] [Term] [Monthly Payment] [Principal] [Insurance] [Escrow] [Loan Officer] [Approval Status]",
        "Tax Return IRS Form 1040 Income Deductions Credits Refund Adjusted Gross Income W-2 1099 Filing Status",
        "[Trading Platform] [Buy] [Sell] [Limit Order] [Market Order] [Execution] [Stop Loss] [Take Profit] [Candlestick Chart] [Technical Analysis]",
        "Insurance Policy Premium Deductible Coverage Limits Claim Status Policyholder Beneficiary Effective Date Renewal Notice",
        "[Payroll] [Paystub] [Gross Pay] [Net Pay] [Taxes] [Withholdings] [Social Security] [Medicare] [Retirement Contribution] [Overtime Hours]",
        "[Invoice] [Bill] [Amount Due] [Service Date] [Due Date] [Payment Terms] [Late Fee] [Remittance Address] [Invoice Number] [Purchase Order]"
    ]
    for s in financial_samples:
        for _ in range(10): # 100 samples total
            data.append({"text": s, "label": "Restricted:Financial"})

    # --- Restricted:Health ---
    health_samples = [
        "[Patient Portal] [Medical Records] [Laboratory Results] [Immunizations] [Health History] [Allergies] [Medications] [Surgeries] [Clinical Notes]",
        "[Appointment Scheduling] [Doctor Visit] [Clinic Location] [Calendar] [Reminders] [Telehealth Session] [Specialist Referral] [Follow-up]",
        "[Prescription Refill] [Pharmacy] [Medication] [Dosage] [Instructions] [Side Effects] [Drug Interactions] [Generic Alternative] [Over-the-counter]",
        "[Health Insurance] [Benefits] [Coverage] [Claims] [Network Providers] [Co-pay] [Co-insurance] [Out-of-pocket Maximum] [Deductible] [Enrollment]",
        "Symptoms Diagnosis Treatment Plan Clinical Notes Physician Assessment Vital Signs Physical Exam Prognosis Medical Advice",
        "Radiology Report X-Ray MRI CT Scan Interpretation Imaging Results Radiologist Findings Contrast Agent Diagnostic Imaging",
        "Blood Test Results Glucose Cholesterol Hemoglobin Vital Signs White Blood Cell Count Platelets Metabolic Panel",
        "Allergies Reactions Medications History Surgeries Family History Social History Lifestyle Factors Mental Health",
        "Mental Health Counseling Therapy Sessions Progress Notes Diagnosis Treatment Goals Cognitive Behavioral Therapy Psychology",
        "Emergency Room Visit Discharge Summary Triage Assessment Vital Signs Chief Complaint Admitting Diagnosis Procedures"
    ]
    for s in health_samples:
        for _ in range(10): # 100 samples total
            data.append({"text": s, "label": "Restricted:Health"})

    # --- Restricted:PII ---
    pii_samples = [
        "[Personal Profile] [First Name] [Last Name] [Date of Birth] [Social Security Number] [Gender] [Nationality] [Ethnicity] [Home Address]",
        "[Contact Information] [Email Address] [Phone Number] [Mailing Address] [Secondary Email] [Emergency Contact] [Work Phone] [Mobile Phone]",
        "[Passport Number] [Drivers License] [State ID] [National Identity Card] [Expiry Date] [Issuing Country] [Social Security Card]",
        "[Emergency Contact Name] [Relationship] [Phone Number] [Address] [Email] [Medical Information] [Allergies] [Blood Type]",
        "Employment History Employer Job Title Salary Benefits Work Address Employee ID Hire Date Termination Date",
        "Educational Background School Degree Graduation Date GPA Transcripts Student ID Major Minor Honors Awards",
        "[Bank Account Number] [Routing Number] [SWIFT Code] [IBAN] [Account Holder Name] [Branch Address] [Online Banking Credentials]",
        "[Credit Card Number] [CVV] [Expiration Date] [Cardholder Name] [Billing Address] [Credit Limit] [Card Type] [Security Code]",
        "Registration Form Full Name Gender Nationality Ethnicity Occupation Education Level Marital Status Number of Dependents",
        "Subscription Details Billing Address Credit Card Information Account Holder Billing Cycle Payment Method Automatic Renewal"
    ]
    for s in pii_samples:
        for _ in range(10): # 100 samples total
            data.append({"text": s, "label": "Restricted:PII"})

    output_path = os.path.join(os.path.dirname(__file__), "synthetic.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"Generated {len(data)} synthetic samples to {output_path}")

if __name__ == "__main__":
    generate_synthetic()
