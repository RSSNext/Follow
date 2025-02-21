//
//  ToasterModule.swift
//
//  Created by Innei on 2025/2/21.
//

import ExpoModulesCore
import SPIndicator

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
    case .info: .success
    case .warn: .warning
    case .success: .error
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

}

public class ToasterModule: Module {
  public func definition() -> ModuleDefinition {
    Name("Toaster")

    Function("toast") { (value: ToastOptions) in

      DispatchQueue.main.sync {
        let indicatorView = SPIndicatorView(
          title: value.title, message: value.message, preset: value.type.type())
        indicatorView.present(duration: value.duration, haptic: value.type.haptic())
      }
    }
  }
}
