// swift-tools-version:5.5
import PackageDescription

let package = Package(
    name: "AleteEdge",
    platforms: [
        .iOS(.v14),
        .macOS(.v11)
    ],
    products: [
        .library(
            name: "AleteClassifierKit",
            targets: ["AleteClassifierKit"]),
    ],
    dependencies: [
        // Zero dependencies for high structural resilience
    ],
    targets: [
        .target(
            name: "AleteClassifierKit",
            path: "ios/AleteClassifier/Sources/AleteClassifierKit",
            resources: [
                .process("Resources")
            ]
        ),
        .testTarget(
            name: "AleteClassifierKitTests",
            dependencies: ["AleteClassifierKit"],
            path: "ios/AleteClassifier/Tests/AleteClassifierKitTests",
            resources: [
                .process("Resources")
            ]
        )
    ]
)
