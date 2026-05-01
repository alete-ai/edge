// swift-tools-version:5.5
import PackageDescription

let package = Package(
    name: "AleteClassifierKit",
    platforms: [
        .iOS(.v14),
        .macOS(.v11)
    ],
    products: [
        .library(
            name: "AleteClassifierKit",
            type: .dynamic,
            targets: ["AleteClassifierKit"]),
    ],
    dependencies: [
        // No external dependencies for high structural resilience
    ],
    targets: [
        .target(
            name: "AleteClassifierKit",
            dependencies: [],
            resources: [.process("Resources")]
        ),
        .testTarget(
            name: "AleteClassifierKitTests",
            dependencies: ["AleteClassifierKit"],
            resources: [.process("Resources")]),
    ]
)
