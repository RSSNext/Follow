//
//  Helper+Image.swift
//  FollowNative
//
//  Created by Innei on 2025/2/7.
//

import ObjectiveC
import QuickLook
import UIKit

class PreviewControllerClass: NSObject, QLPreviewControllerDataSource, QLPreviewControllerDelegate {
  private var imageDataArray: [Data] = []

  init(images: [Data]) {
    self.imageDataArray = images
    super.init()
  }

  func numberOfPreviewItems(in controller: QLPreviewController) -> Int {
    return imageDataArray.count
  }

  func previewController(_ controller: QLPreviewController, previewItemAt index: Int)
    -> QLPreviewItem
  {
    let tempURL = FileManager.default.temporaryDirectory.appendingPathComponent(
      "preview_image_\(index).jpg")
    try? imageDataArray[index].write(to: tempURL)
    return tempURL as QLPreviewItem
  }

  private func cleanupTempFiles() {
    for index in 0..<imageDataArray.count {
      let tempURL = FileManager.default.temporaryDirectory.appendingPathComponent(
        "preview_image_\(index).jpg")
      try? FileManager.default.removeItem(at: tempURL)
    }
  }

  func previewControllerDidDismiss(_ controller: QLPreviewController) {
    cleanupTempFiles()
  }
 
}


class ImagePreview: NSObject {
  public static func quickLookImage(_ images: [Data]) {
    guard let rootViewController = UIApplication.shared.keyWindow?.rootViewController else {
      return
    }

    if images.count == 0 {
      print("no preview data")
      return
    }
    let previewController = QLPreviewController()
    let previewControllerClass = PreviewControllerClass(images: images)
    previewController.view.tintColor = Utils.accentColor
    previewController.dataSource = previewControllerClass
    previewController.delegate = previewControllerClass

    rootViewController.present(previewController, animated: true)
  }
}
