//
//  GaleriaAccessoryModule.swift
//  FollowNative
//
//  Created by Innei on 2025/3/10.
//

import ExpoModulesCore
import SwiftUI

struct EntryGaleriaAccessoryProps: Record {
  @Field var author: String
  @Field var avatarUrl: String?
  @Field var publishedAt: Date = .distantFuture
}

public class GaleriaAccessoryModule: Module {
  // Use NSMapTable to weakly reference VCs and their accessory views
  private static var accessoryViews = NSMapTable<ImageCarouselViewController, UIView>
    .weakToWeakObjects()

  public func definition() -> ModuleDefinition {
    Name("FollowGaleriaAccessory")

    Function("showEntryGaleriaAccessory") { (props: EntryGaleriaAccessoryProps) in
      DispatchQueue.main.async {
        guard let galeriaVC = UIWindow.findViewController(ofType: ImageCarouselViewController.self)
        else {
          return
        }

        // Check if this VC has already added an accessory view
        if GaleriaAccessoryModule.accessoryViews.object(forKey: galeriaVC) != nil {
          return
        }

        let avatarURL = URL(string: props.avatarUrl ?? "")

        let hostingVC = UIHostingController(
          rootView: EntryGaleriaAccessoryView(
            author: props.author, avatarUrl: avatarURL, publishedAt: props.publishedAt))

        if let galeriaView = galeriaVC.view, let window = galeriaView.window {
          hostingVC.view.translatesAutoresizingMaskIntoConstraints = false
          galeriaView.addSubview(hostingVC.view)

          hostingVC.view.backgroundColor = .clear
          hostingVC.view.sizeToFit()
          hostingVC.view.setContentHuggingPriority(.defaultHigh, for: .vertical)
          hostingVC.view.setContentCompressionResistancePriority(.defaultHigh, for: .vertical)

          NSLayoutConstraint.activate([
            hostingVC.view.leadingAnchor.constraint(equalTo: window.leadingAnchor),
            hostingVC.view.trailingAnchor.constraint(equalTo: window.trailingAnchor),
            hostingVC.view.bottomAnchor.constraint(equalTo: window.bottomAnchor),
          ])

          // Associate the accessory view with the VC

          GaleriaAccessoryModule.accessoryViews.setObject(hostingVC.view, forKey: galeriaVC)

          var observerRef: NSObjectProtocol?

          // Use the correct notification name and create an observer object
          observerRef = NotificationCenter.default.addObserver(
            forName: NSNotification.Name("UIViewControllerDidMoveToParentViewController"),
            object: galeriaVC,
            queue: nil
          ) { [weak galeriaVC] _ in
            guard let vc = galeriaVC else { return }

            if vc.parent == nil {
              // VC has been removed, clean up related views
              if let accessoryView = GaleriaAccessoryModule.accessoryViews.object(forKey: vc) {
                accessoryView.removeFromSuperview()
                GaleriaAccessoryModule.accessoryViews.removeObject(forKey: vc)
              }

              // Remove the observer
              if let observer = observerRef {
                NotificationCenter.default.removeObserver(observer)
              }
            }
          }

          // Add a deinit observer to ensure resources are cleaned up when the VC is released
          galeriaVC.onDeinit {
            if let accessoryView = GaleriaAccessoryModule.accessoryViews.object(forKey: galeriaVC) {
              accessoryView.removeFromSuperview()
              GaleriaAccessoryModule.accessoryViews.removeObject(forKey: galeriaVC)
            }

            if let observer = observerRef {
              NotificationCenter.default.removeObserver(observer)
            }
          }
        }
      }
    }
  }
}

// Extension UIViewController to add deinit callback functionality
extension UIViewController {
  private static var deinitCallbackKey = "deinitCallbackKey"

  typealias DeinitCallback = () -> Void

  func onDeinit(_ callback: @escaping DeinitCallback) {
    let token = DeinitObserver(callback: callback)
    objc_setAssociatedObject(
      self, &UIViewController.deinitCallbackKey, token, .OBJC_ASSOCIATION_RETAIN_NONATOMIC)
  }
}

// Auxiliary class for observing deinit
private class DeinitObserver {
  private let callback: () -> Void

  init(callback: @escaping () -> Void) {
    self.callback = callback
  }

  deinit {
    callback()
  }
}

