//
//  FullScreenWKWebview.swift
//  FollowNative
//
//  Created by Innei on 2025/2/7.
//

import WebKit
class FullScreenWKWebView: WKWebView {
    override var safeAreaInsets: UIEdgeInsets {
        return UIEdgeInsets(top: 0, left: 0, bottom: 0, right: 0)
    }
}
