//
//  HelperModule.swift
//  Pods
//
//  Created by Innei on 2025/2/7.
//
import ExpoModulesCore
import UIKit

 
public class HelperModule: Module {
  
  
  public func definition() -> ExpoModulesCore.ModuleDefinition {
    Name("Helper")

    AsyncFunction("openLink") { (urlString: String, promise: Promise) in
      guard let url = URL(string: urlString) else {
        return
      }
      DispatchQueue.main.async {
        guard let rootVC = Utils.getRootVC() else { return }
        
        let onDismiss = {
          promise.resolve(["type": "dismiss"])
        }
        
        WebViewManager.presentModalWebView(url: url, from: rootVC, onDismiss: onDismiss)
      }
    }

    Function("scrollToTop") { (reactTag: Int) in
      DispatchQueue.main.async { [weak self] in
        guard let bridge = self?.appContext?.reactBridge else {

          return
        }

        if let sourceView = bridge.uiManager.view(forReactTag: NSNumber(value: reactTag)) {

          let scrollView = self?.findUIScrollView(view: sourceView)
          guard let scrollView = scrollView else {
            return
          }
          scrollView.scrollToTopIfPossible(animated: true)

        }

      }

    }
  }

  private func findUIScrollView(view: UIView?) -> UIScrollView? {
    guard let view = view else {
      return nil
    }
    if let view = view as? UIScrollView {
      return view
    }

    let subviews = view.subviews
    for (view) in subviews {
      let targetView = self.findUIScrollView(view: view)
      if let targetView = targetView {
        return targetView
      }
    }

    return nil

  }
}

extension UIScrollView {
  func scrollToTopIfPossible(animated: Bool) {
    let encodedSelector = "X3Njcm9sbFRvVG9wSWZQb3NzaWJsZTo="  // "_scrollToTopIfPossible:"

    if let decodedData = Data(base64Encoded: encodedSelector),
      let decodedString = String(data: decodedData, encoding: .utf8)
    {

      let selector = NSSelectorFromString(decodedString)
      if self.responds(to: selector) {
        self.perform(selector, with: animated)
      } else {
        print("UIScrollView does not respond to decoded method")
        self.setContentOffset(.zero, animated: animated)
      }
    } else {
      self.setContentOffset(.zero, animated: animated)
    }
  }
}
