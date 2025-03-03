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
    static let state = WebViewState()
    static weak var linkDelegate: WebViewLinkDelegate?

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
        let configuration = WKWebViewConfiguration()
        let bundle = Utils.bundle

        let hexAccentColor = Utils.accentColor.toHex()
        let css = """
                :root { overflow: hidden !important; overflow-behavior: none !important; }
                body { 
                    overflow-y: visible !important;
                    position: absolute !important;
                    width: 100% !important;
                    height: auto !important;
                    -webkit-overflow-scrolling: touch !important;
                }
                ::selection {
                    background-color: \(hexAccentColor) !important;
                }
            """

        let script = WKUserScript(
            source: """
                    var style = document.createElement('style');
                    style.textContent = '\(css)';
                    document.head.appendChild(style);
                """,
            injectionTime: .atDocumentStart,
            forMainFrameOnly: true
        )

        let jsString = loadInjectedJs(forResource: "at_start")

        if let jsString = jsString {
            let script = WKUserScript(
                source: jsString,
                injectionTime: .atDocumentStart,
                forMainFrameOnly: true
            )
            configuration.userContentController.addUserScript(script)
        }

        configuration.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")

        let schemeHandler = CustomURLSchemeHandler()
        configuration.setURLSchemeHandler(
            schemeHandler, forURLScheme: CustomURLSchemeHandler.rewriteScheme)

        let customSchemeScript = WKUserScript(
            source: """
                (function() {
                    const originalXHROpen = XMLHttpRequest.prototype.open;
                    XMLHttpRequest.prototype.open = function(method, url, ...args) {
                        const modifiedUrl = url.replace(/^https?:/, '\(CustomURLSchemeHandler.rewriteScheme):');
                        originalXHROpen.call(this, method, modifiedUrl, ...args);
                    };

                    const originalFetch = window.fetch;
                    window.fetch = function(url, options) {
                        const modifiedUrl = url.replace(/^https?:/, '\(CustomURLSchemeHandler.rewriteScheme):');
                        return originalFetch(modifiedUrl, options);
                    };

                    const originalImageSrc = Object.getOwnPropertyDescriptor(Image.prototype, 'src');
                    Object.defineProperty(Image.prototype, 'src', {
                        set: function(url) {
                            const modifiedUrl = url.replace(/^https?:/, '\(CustomURLSchemeHandler.rewriteScheme):');
                            originalImageSrc.set.call(this, modifiedUrl);
                        }
                    });
                })();
                """,
            injectionTime: .atDocumentStart,
            forMainFrameOnly: false
        )
        configuration.userContentController.addUserScript(customSchemeScript)

        let webView = FOWebView(frame: .zero, configuration: configuration)

        setupWebView(webView)

        return webView
    }()

    private static func setupWebView(_ webView: WKWebView) {
        guard let viewController = Utils.getRootVC() else { return }
        let delegate = WebViewDelegate(state: state, viewController: viewController)
        webView.navigationDelegate = delegate
        webView.uiDelegate = delegate

        let jsString = self.loadInjectedJs(forResource: "at_end")
        guard let jsString = jsString else {
            print("Failed to load injected js")
            return
        }
        let script = WKUserScript(
            source: jsString,
            injectionTime: .atDocumentEnd,
            forMainFrameOnly: true
        )

        webView.configuration.userContentController.add(delegate, name: "message")
        webView.configuration.userContentController.addUserScript(script)
    }

    static func resetWebView() {
        let newWebView = WKWebView(frame: .zero, configuration: WKWebViewConfiguration())
        setupWebView(newWebView)
        shared = newWebView
    }

    private static func loadInjectedJs(forResource: String) -> String? {
        if let bundleURL = Bundle(for: WebViewView.self).url(
            forResource: "js", withExtension: "bundle"),
            let resourceBundle = Bundle(url: bundleURL)
        {

            if let jsPath = resourceBundle.path(forResource: forResource, ofType: "js") {
                do {
                    let initJsContent = try String(contentsOfFile: jsPath, encoding: .utf8)

                    return initJsContent
                } catch {
                    print("Error reading JS file:", error)
                }
            }

        }
        return nil
    }

    static func presentModalWebView(url: URL, from viewController: UIViewController) {

      let safariVC = SFSafariViewController(url: url)
      safariVC.view.tintColor = Utils.accentColor
      safariVC.preferredControlTintColor = Utils.accentColor
      viewController.present(safariVC, animated: true)
    }

}

private class WebViewDelegate: NSObject, WKNavigationDelegate, WKScriptMessageHandler, WKUIDelegate
{
    private let state: WebViewState
    private weak var viewController: UIViewController?

    init(state: WebViewState, viewController: UIViewController?) {
        self.state = state
        self.viewController = viewController
        super.init()
    }

    func userContentController(
        _ userContentController: WKUserContentController, didReceive message: WKScriptMessage
    ) {
        debugPrint("message", message.body)
        if message.name == "message" {
            let body = message.body

            if let jsonString = body as? String, let decode = jsonString.data(using: .utf8) {
                let data = try? JSONDecoder().decode(BridgeDataBasePayload.self, from: decode)
                guard let data = data else { return }

                switch data.type {
                case "setContentHeight":
                    let data = try? JSONDecoder().decode(
                        SetContentHeightPayload.self, from: decode)
                    guard let data = data else { return }

                    DispatchQueue.main.async {
                        self.state.contentHeight = data.payload
                    }

                case "measure":
                    self.measureWebView(SharedWebViewModule.sharedWebView!)

                case "previewImage":
                    let data = try? JSONDecoder().decode(
                        PreviewImagePayload.self, from: decode)

                    guard let data = data else { return }
                    DispatchQueue.main.async {
                        ImagePreview.quickLookImage(
                            data.payload.images.compactMap { Data($0) })
                    }

                default:
                    break
                }

            }

        }
    }

    private func measureWebView(_ webView: WKWebView) {
        let jsCode = "document.querySelector('#root').scrollHeight"
        webView.evaluateJavaScript(jsCode) { (height, error) in
            if let height = height as? CGFloat, height > 0 {
                DispatchQueue.main.async {
                    self.state.contentHeight = height
                    debugPrint("measure", height)
                }
            }
        }
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        measureWebView(webView)

        Timer.scheduledTimer(withTimeInterval: 1, repeats: false) { [weak self] _ in
            self?.measureWebView(webView)
        }

        for js in pendingJavaScripts {
            webView.evaluateJavaScript(js) { (_, error) in
                if let error = error {
                    print("Error evaluating JavaScript:", error)
                }
            }
        }
        pendingJavaScripts.removeAll()

    }

    func webView(
        _ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration,
        for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures
    ) -> WKWebView? {
        if let url = navigationAction.request.url,
            let viewController = self.viewController
        {
            WebViewManager.presentModalWebView(url: url, from: viewController)
        }
        return nil
    }

    func webView(
        _ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction,
        decisionHandler: @escaping (WKNavigationActionPolicy) -> Void
    ) {
        if navigationAction.targetFrame == nil {
            if let url = navigationAction.request.url,
                let viewController = self.viewController
            {
                WebViewManager.presentModalWebView(url: url, from: viewController)
                decisionHandler(.cancel)
                return
            }
        }
        decisionHandler(.allow)
    }
}
