//
//  WebViewManager.swift
//  FollowNative
//
//  Created by Innei on 2025/1/31.
//
import Combine
import ExpoModulesCore
import SafariServices
@preconcurrency import WebKit

private var pendingJavaScripts: [String] = []

// Add protocol for handling link clicks
protocol WebViewLinkDelegate: AnyObject {
    func webView(_ webView: WKWebView, shouldOpenURL url: URL)
}

enum WebViewManager {
    static var state = WebViewState()

    public static func evaluateJavaScript(_ js: String) {
        DispatchQueue.main.async {
            guard let webView = SharedWebViewModule.sharedWebView else {
                pendingJavaScripts.append(js)
                return
            }
            guard webView.url != nil else {
                pendingJavaScripts.append(js)
                return
            }

            if webView.isLoading {
                pendingJavaScripts.append(js)
            } else {
                webView.evaluateJavaScript(js)
            }

        }

    }

    static private(set) var shared: WKWebView = {
        FOWebView(frame: .zero, state: state)

    }()

    static func resetWebView() {
        self.state = WebViewState()
        self.shared = FOWebView(frame: .zero, state: state)
    }

    static func presentModalWebView(url: URL, from viewController: UIViewController) {

        let safariVC = SFSafariViewController(url: url)
        safariVC.view.tintColor = Utils.accentColor
        safariVC.preferredControlTintColor = Utils.accentColor
        viewController.present(safariVC, animated: true)
    }

}
//
//extension WebViewManager {
//    private static var contentHeightChangeListeners: [Int: (Float) -> Void] = [:]
//    private static var contentHeightChangeListenerId = 0
//
//    static func addContentHeightChangeListener(_ listener: @escaping (Float) -> Void) -> Int {
//        let listenerId = contentHeightChangeListenerId
//        contentHeightChangeListenerId += 1
//        contentHeightChangeListeners[listenerId] = listener
//        return listenerId
//    }
//
//    static func removeContentHeightChangeListener(_ listenerId: Int) {
//        contentHeightChangeListeners.removeValue(forKey: listenerId)
//    }
//
////    static func notifyContentHeightChange(_ height: Float) {
////        for listener in contentHeightChangeListeners.values {
////            DispatchQueue.main.async {
////                listener(height)
////            }
////        }
////    }
//}
