//
//  FOWebView.swift
//  FollowNative
//
//  Created by Innei on 2025/2/7.
//

import WebKit

class FOWebView: WKWebView {
  private func setupView() {
    scrollView.isScrollEnabled = false
    scrollView.bounces = false
    scrollView.contentInsetAdjustmentBehavior = .never

    isOpaque = false
    backgroundColor = UIColor.clear
    scrollView.backgroundColor = UIColor.clear
    tintColor = Utils.accentColor

    if #available(iOS 16.4, *) {
      isInspectable = true
    }

  }

  override init(frame: CGRect, configuration: WKWebViewConfiguration) {
    super.init(frame: frame, configuration: configuration)
    setupView()
  }

  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
}
