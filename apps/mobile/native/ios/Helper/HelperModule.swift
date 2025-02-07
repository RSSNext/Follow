//
//  HelperModule.swift
//  Pods
//
//  Created by Innei on 2025/2/7.
//
import ExpoModulesCore

public class HelperModule: Module {
  public func definition() -> ExpoModulesCore.ModuleDefinition {
    Name("Helper")

    Function("openLink") { (urlString: String) in
      guard let url = URL(string: urlString) else {
        return
      }
      DispatchQueue.main.async {
        guard let rootVC = UIApplication.shared.windows.first?.rootViewController else { return }
        WebViewManager.presentModalWebView(url: url, from: rootVC)
      }
    }

    Function("previewImage") { (images: [String]) in
      let imagesData: [Data] =
        images.compactMap { image in
          let url = URL(string: image)
          let data = try? Data(contentsOf: url!)
          return data
        }
      DispatchQueue.main.async {
        ImagePreview.quickLookImage(imagesData)
      }
    }
  }
}
