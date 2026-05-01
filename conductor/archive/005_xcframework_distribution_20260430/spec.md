# Specification: XCFramework Binary Distribution

## 1. Objectives
- Distribute `AleteClassifier` as a pre-compiled `XCFramework`.
- Support iOS and iOS Simulator (macOS support optional but desired).
- Comply with Apple's 2025 Privacy Manifest requirements.
- Automate the build, sign, and checksum process.
- Provide a clean `.binaryTarget` entry for consumers.

## 2. Core Frameworks & Tools
- **Substrate:** Swift Package Manager (SPM).
- **Build System:** `xcodebuild` CLI.
- **Security:** Apple Distribution Certificate for Code Signing.
- **Privacy:** `PrivacyInfo.xcprivacy`.
- **Distribution:** GitHub Releases (hosting the `.zip` archive).

## 3. Technical Requirements

### 3.1 Library Evolution
The framework must be built with `BUILD_LIBRARY_FOR_DISTRIBUTION=YES` to ensure binary compatibility across Swift versions (Module Stability).

### 3.2 Privacy Manifest
A `PrivacyInfo.xcprivacy` file must be included in the framework's Resources. It must declare use of any "Required Reason" APIs if present in `Surge` or our own code (e.g., `UserDefaults`).

### 3.3 Code Signing
Binary XCFrameworks distributed via SPM should be signed to ensure authenticity.

### 3.4 Verification
The distribution process must include a checksum computation (`swift package compute-checksum`) to ensure integrity.

## 4. Consumer Experience

### 4.1 Installation Instructions
To integrate `AleteClassifier` into an app, consumers will:
1. Open their Xcode project.
2. Select **File > Add Package Dependencies...**
3. Enter the repository URL: `https://github.com/StoyanD/edge` (or the dedicated distribution repo).
4. Select the version or branch.
5. Xcode will automatically download the binary and link it.

Alternatively, for `Package.swift` consumers:
```swift
dependencies: [
    .package(url: "https://github.com/StoyanD/edge", from: "1.0.0")
]
```

## 5. CI/CD: GitHub Actions vs. Xcode Cloud
| Feature | GitHub Actions | Xcode Cloud |
|---------|----------------|-------------|
| **Simplicity** | High (for scripting) | High (for standard apps) |
| **Monorepo Support** | Excellent | Limited/Complex |
| **Signing** | Manual Secrets | Automatic |
| **Asset Distribution** | Native (GH Releases) | N/A (Internal only) |

**Conclusion:** GitHub Actions is recommended for this track because it allows us to automate the creation of the `.zip` archive and the computation of the SHA256 checksum in a single workflow.

