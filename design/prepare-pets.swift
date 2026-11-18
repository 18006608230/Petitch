import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

// design/pets/<id>.jpg 是手工裁好的原图（源），这里只做居中裁方 + 缩到 200，产出 src/assets/pets/<id>.jpg。
// 图块不透明，所以用 JPEG q82；PNG 同一套要 640 KB，JPEG 100 KB。重跑：swift design/prepare-pets.swift
let ids = ["dog", "cat", "rabbit", "hamster", "parrot", "turtle",
           "chinchilla", "hedgehog", "goldfish", "gecko", "guinea-pig", "ferret"]
let inDir = "design/pets", outDir = "src/assets/pets", side = 200

let space = CGColorSpace(name: CGColorSpace.sRGB)!
try? FileManager.default.createDirectory(atPath: outDir, withIntermediateDirectories: true)

for id in ids {
    let inURL = URL(fileURLWithPath: "\(inDir)/\(id).jpg") as CFURL
    guard let src = CGImageSourceCreateWithURL(inURL, nil),
          let cg = CGImageSourceCreateImageAtIndex(src, 0, nil) else {
        print("MISSING \(inDir)/\(id).jpg"); exit(1)
    }
    let w = cg.width, h = cg.height
    let s = min(w, h)
    let square = CGRect(x: CGFloat(w - s) / 2, y: CGFloat(h - s) / 2, width: CGFloat(s), height: CGFloat(s))
    guard let cut = cg.cropping(to: square) else { print("crop fail \(id)"); exit(1) }
    var dst = [UInt8](repeating: 0, count: side * side * 4)
    guard let oc = CGContext(data: &dst, width: side, height: side, bitsPerComponent: 8,
                             bytesPerRow: side * 4, space: space,
                             bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue) else { exit(1) }
    oc.interpolationQuality = .high
    oc.draw(cut, in: CGRect(x: 0, y: 0, width: side, height: side))
    guard let out = oc.makeImage() else { print("encode fail \(id)"); exit(1) }
    let outURL = URL(fileURLWithPath: "\(outDir)/\(id).jpg") as CFURL
    guard let dest = CGImageDestinationCreateWithURL(outURL, UTType.jpeg.identifier as CFString, 1, nil) else {
        print("dest fail \(id)"); exit(1)
    }
    CGImageDestinationAddImage(dest, out, [kCGImageDestinationLossyCompressionQuality: 0.82] as CFDictionary)
    guard CGImageDestinationFinalize(dest) else { print("write fail \(id)"); exit(1) }
    print("\(id): \(w)x\(h) -> \(side)x\(side)")
}
