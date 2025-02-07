//
//  Utils.swift
//  FollowNative
//
//  Created by Innei on 2025/2/7.
//

import Foundation

class Noop {}
enum Utils {
  static let bundle = Bundle(for: Noop.self)
  static let accentColor =
      UIColor(named: "Accent", in: bundle, compatibleWith: nil) ?? UIColor.systemBlue
}
