// swift-tools-version:5.5
import PackageDescription

let package = Package(
    name: "AleteClassifier",
    platforms: [
        .iOS(.v14),
        .macOS(.v11)
    ],
    products: [
        .library(
            name: "AleteClassifier",
            targets: ["AleteClassifier"]),
    ],
    dependencies: [
        .package(url: "https://github.com/Jounce/Surge.git", from: "2.3.2")
    ],
    targets: [
        .target(
            name: "AleteClassifier",
            dependencies: ["Surge"],
            resources: [.process("Resources")]
        ),
        .testTarget(
            name: "AleteClassifierTests",
            dependencies: ["AleteClassifier"],
            resources: [.process("Resources")]),
    ]
)
