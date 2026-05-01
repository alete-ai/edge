# Implementation Plan: XCFramework Binary Distribution

## Phase 1: Compliance & Substrate Preparation
- [x] Create `PrivacyInfo.xcprivacy` manifest in `ios/AleteClassifier/Sources/AleteClassifier/Resources/`
- [x] Audit dependencies (Removed `Surge` to resolve library evolution issues)
- [x] Verify `Package.swift` resources configuration

## Phase 2: Automation Scripting
- [x] Create `scripts/build_xcframework.sh`
    - [x] Add `xcodebuild archive` commands for iOS Device and Simulator
    - [x] Add `xcodebuild -create-xcframework` command
    - [x] Add code signing step
    - [x] Add zip and checksum computation logic
- [x] Test the script locally

## Phase 3: Distribution Pipeline
- [x] Configure GitHub Actions workflow (`.github/workflows/release-xcframework.yml`)
    - [x] Trigger on tag creation
    - [x] Build and sign XCFramework
    - [x] Upload zip to GitHub Release
    - [x] Output checksum for manifest update

## Phase 4: Consumer Integration
- [ ] Create a "Distribution" branch or repository structure
- [ ] Update `Package.swift` to use `.binaryTarget`
- [ ] Validate integration in a test consumer project

## Phase 5: Verification (Structural Resilience)
- [ ] Verify module stability (`.swiftinterface` files present)
- [ ] Verify signature integrity
- [ ] Verify privacy manifest inclusion in final binary
