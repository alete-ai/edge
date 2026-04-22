# Specification: AleteEdge Data Sanitization Layer

## 1. Overview
The **Data Sanitization Layer** is a specialized module for the `AleteEdge` library. Its primary function is to intercept the markdown generated after HTML classification and "scrub" it for sensitive information before it is passed to LLMs or stored. This ensures compliance and trust.

## 2. Objectives
- **Performance:** Ensure <10ms overhead per 1KB of markdown processing on edge runtimes (Vercel Edge / Cloudflare Workers).
- **Security:** Redact sensitive data with informative placeholders (e.g., `[EMAIL_REDACTED]`) to maintain context while ensuring security.
- **Privacy-by-Design:** Prioritize data protection as a core product value.

## 3. Targeted Sensitive Data Categories

### 3.1 PII (Personally Identifiable Information)
- **Email Addresses:** Standard regex for international formats.
- **Phone Numbers:** Detection of various national and international formats.
- **Government IDs:** Social Security Numbers (SSN), Passport numbers, Driver's licenses.
- **Physical Addresses:** Detection of street-level addresses and postcodes.

### 3.2 Financial Data
- **Payment Cards:** Credit/Debit card numbers (Luhn algorithm validation where possible).
- **Banking Info:** IBAN, Routing numbers, SWIFT/BIC codes.
- **Financial Records:** Generic patterns for transaction IDs and account balances.

### 3.3 Credentials & Authentication
- **Secrets:** API Keys (AWS, Stripe, OpenAI, etc.), Secret Tokens.
- **Auth Tokens:** JWTs, Bearer tokens, Session cookies.
- **Keys:** SSH Private Keys, PGP Keys.
- **Passwords:** Detection of common password patterns and "password=" fields in URLs/text.

### 3.4 Infrastructure & Metadata
- **Network:** IP Addresses (IPv4/IPv6), MAC Addresses.
- **Filesystem:** Local file paths (e.g., `/Users/`, `C:\Users\`).
- **Health:** Medical Record Numbers (MRN) for HIPAA compliance.

## 4. Technical Framework
- **Primary Library:** `@hackylabs/deep-redact` (Zero-dependency, edge-compatible).
- **Environment:** Must run in any JS environment (Node.js, Edge Runtime, Browser).
- **Interface:** A simple `redact(text: string): string` function added to the `AleteEdge` pipeline.

## 5. Success Metrics
- **Performance:** Processing speed < 10ms per 1KB.
- **Accuracy:** >98% detection of standard sensitive patterns (Emails, CCs, API Keys).
- **Security:** No sensitive data leaks into logs or prompts during automated testing.
