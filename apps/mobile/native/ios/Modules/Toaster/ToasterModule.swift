//
//  ToasterModule.swift
//
//  Created by Innei on 2025/2/21.
//

import ExpoModulesCore

enum ToastType: String, Enumerable {
  case error
  case info
  case warn
  case success
}

extension ToastType {
  func type() -> SPIndicatorIconPreset {
    switch self
    {
    case .error: .error
    case .warn: .custom(UIImage(systemName: "exclamationmark.triangle")!.withTintColor(.orange))
    case .info: .custom(UIImage(systemName: "info.circle")!.withTintColor(.blue))
    case .success: .done
    }
  }

  func haptic() -> SPIndicatorHaptic {
    switch self {
    case .error: .error
    case .info: .none
    case .warn: .warning
    case .success: .success
    }
  }
}

enum Position: String, Enumerable {
  case top
  case center
  case bottom
}

extension Position {
  func toSPPresentSide() -> SPIndicatorPresentSide {
    switch self {
    case .top: .top
    case .center: .center
    case .bottom: .bottom
    }
  }
}

struct ToastOptions: Record {
  @Field
  var message: String?
  @Field
  var type: ToastType = .info
  @Field
  var duration: Double = 1.5
  @Field
  var title: String
  @Field
  var position: Position?
}

public class ToasterModule: Module {
  public func definition() -> ModuleDefinition {
    Name("Toaster")

    Function("toast") { (value: ToastOptions) in

      DispatchQueue.main.sync {
        let indicatorView = SPIndicatorView(
          title: value.title, message: value.message, preset: value.type.type())

        if value.position != nil {
          indicatorView.presentSide = value.position!.toSPPresentSide()
        }

        indicatorView.present(duration: value.duration, haptic: value.type.haptic())
      }
    }
  }
}
