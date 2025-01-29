//
//  File.swift
//  boost-boost_privacy
//
//  Created by Innei on 2025/1/29.
//

import ExpoModulesCore
import WebKit

public class SharedWebViewModule: Module {
    public static var sharedWebView: WKWebView?

    public func definition() -> ModuleDefinition {
        Name("FOSharedWebView")

        Function("preload") { (url: String) in
            guard let webUrl = URL(string: url) else { return }
            if SharedWebViewModule.sharedWebView == nil {
                SharedWebViewModule.sharedWebView = WKWebView()
            }
            let request = URLRequest(url: webUrl)
            SharedWebViewModule.sharedWebView?.load(request)
        }

        View(WebViewComponentView.self) {
            Prop("url") { (view, url: String) in
                if let webUrl = URL(string: url) {
                    if view.webView.url == webUrl { return }
                    let request = URLRequest(url: webUrl)

                    view.webView.load(request)
                }
            }
        }
    }
}
