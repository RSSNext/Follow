//
//  Helper+Image.swift
//  FollowNative
//
//  Created by Innei on 2025/2/7.
//

import QuickLook
import SDWebImage
import UIKit

private let previewContentDirectory = URL(fileURLWithPath: NSTemporaryDirectory())
  .appendingPathComponent(Bundle.main.bundleIdentifier!)
  .appendingPathComponent("image-preview")

class PreviewControllerController: QLPreviewController, QLPreviewControllerDataSource,
  QLPreviewControllerDelegate
{
  private var imageDataArray: [Data] = []
  private var initialIndex: Int = 0

  func numberOfPreviewItems(in controller: QLPreviewController) -> Int {
    return imageDataArray.count
  }

  func prepareImages(_ images: [Data], initialIndex: Int = 0) {
    self.imageDataArray = images
    self.initialIndex = initialIndex
  }

  func previewController(_ controller: QLPreviewController, previewItemAt index: Int)
    -> QLPreviewItem
  {
    let imageData = imageDataArray[index]
    guard let image = UIImage(data: imageData) else {
      return previewContentDirectory as QLPreviewItem
    }
    try? FileManager.default.createDirectory(
      at: previewContentDirectory, withIntermediateDirectories: true)

    let tempLocation =
      previewContentDirectory
      .appendingPathComponent(UUID().uuidString)
      .appendingPathExtension(image.sd_imageFormat.possiblePathExtension)

    try? imageData.write(to: tempLocation)
    return tempLocation as QLPreviewItem
  }

  override func viewDidLoad() {
    debugPrint(previewContentDirectory, "previewContentDirectory")

    super.viewDidLoad()
    delegate = self
    dataSource = self
    view.tintColor = Utils.accentColor

    // Set initial preview index
    if initialIndex < imageDataArray.count {
      self.currentPreviewItemIndex = initialIndex
    }
  }

  private func cleanupTempFiles() {
    try? FileManager.default.removeItem(at: previewContentDirectory)
  }

  func previewControllerDidDismiss(_ controller: QLPreviewController) {
    cleanupTempFiles()
  }

  deinit {
    self.cleanupTempFiles()
  }

}

class ImagePreview: NSObject {
  public static func quickLookImage(_ images: [Data], index: Int = 0) {
    guard let rootViewController = UIApplication.shared.keyWindow?.rootViewController else {
      return
    }

    if images.count == 0 {
      print("no preview data")
      return
    }

    let previewController = PreviewControllerController()
    previewController.prepareImages(images, initialIndex: index)

    rootViewController.present(previewController, animated: true)
  }
}

extension SDImageFormat {
  var possiblePathExtension: String {
    switch self {
    case .undefined: ""
    case .JPEG: "jpg"
    case .PNG: "png"
    case .GIF: "gif"
    case .TIFF: "tiff"
    case .webP: "webp"
    case .HEIC: "heic"
    case .HEIF: "heif"
    case .PDF: "pdf"
    case .SVG: "svg"
    default: "png"
    }
  }
}
