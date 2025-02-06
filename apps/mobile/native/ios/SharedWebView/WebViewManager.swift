//
//  WebViewManager.swift
//  FollowNative
//
//  Created by Innei on 2025/1/31.
//
import Combine
import ExpoModulesCore
import WebKit

private let rewriteScheme = "follow-xhr"
private class CustomURLSchemeHandler: NSObject, WKURLSchemeHandler {
    func webView(_ webView: WKWebView, start urlSchemeTask: WKURLSchemeTask) {
        guard let url = urlSchemeTask.request.url,
            let originalURLString = url.absoluteString.replacingOccurrences(
                of: rewriteScheme, with: "https"
            ).removingPercentEncoding,
            let originalURL = URL(string: originalURLString)
        else {
            urlSchemeTask.didFailWithError(NSError(domain: "", code: -1))
            return
        }

        var request = URLRequest(url: originalURL)

        request.httpMethod = urlSchemeTask.request.httpMethod
        request.httpBody = urlSchemeTask.request.httpBody

        // setting headers
        var headers = urlSchemeTask.request.allHTTPHeaderFields ?? [:]
        if let urlComponents = URLComponents(url: originalURL, resolvingAgainstBaseURL: false),
            let scheme = urlComponents.scheme,
            let host = urlComponents.host
        {
            let origin = "\(scheme)://\(host)\(urlComponents.port.map { ":\($0)" } ?? "")"
            headers["Referer"] = origin
            headers["Origin"] = origin

        }
        request.allHTTPHeaderFields = headers

        let task = URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                urlSchemeTask.didFailWithError(error)
                return
            }

            if let response = response as? HTTPURLResponse, let data = data {
                urlSchemeTask.didReceive(response)
                urlSchemeTask.didReceive(data)
                urlSchemeTask.didFinish()
            }
        }
        task.resume()
    }

    func webView(_ webView: WKWebView, stop urlSchemeTask: WKURLSchemeTask) {

    }
}

enum WebViewManager {
    static let state = WebViewState()

    static private(set) var shared: WKWebView = {
        let configuration = WKWebViewConfiguration()
        let bundle = Bundle(for: WebViewView.self)
        let accentColor =
            UIColor(named: "Accent", in: bundle, compatibleWith: nil) ?? UIColor.systemBlue
        let hexAccentColor = accentColor.toHex()
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

        configuration.userContentController.addUserScript(script)
        configuration.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")

        let schemeHandler = CustomURLSchemeHandler()
        configuration.setURLSchemeHandler(schemeHandler, forURLScheme: rewriteScheme)

        let customSchemeScript = WKUserScript(
            source: """
                (function() {
                    const originalXHROpen = XMLHttpRequest.prototype.open;
                    XMLHttpRequest.prototype.open = function(method, url, ...args) {
                        const modifiedUrl = url.replace(/^https?:/, '\(rewriteScheme):');
                        originalXHROpen.call(this, method, modifiedUrl, ...args);
                    };

                    const originalFetch = window.fetch;
                    window.fetch = function(url, options) {
                        const modifiedUrl = url.replace(/^https?:/, '\(rewriteScheme):');
                        return originalFetch(modifiedUrl, options);
                    };

                    const originalImageSrc = Object.getOwnPropertyDescriptor(Image.prototype, 'src');
                    Object.defineProperty(Image.prototype, 'src', {
                        set: function(url) {
                            const modifiedUrl = url.replace(/^https?:/, '\(rewriteScheme):');
                            originalImageSrc.set.call(this, modifiedUrl);
                        }
                    });
                })();
                """,
            injectionTime: .atDocumentStart,
            forMainFrameOnly: false
        )
        configuration.userContentController.addUserScript(customSchemeScript)

        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.scrollView.isScrollEnabled = false
        webView.scrollView.bounces = false
        webView.tintColor = .init(named: "Accent")
        #if DEBUG
            if #available(iOS 16.4, *) {
                webView.isInspectable = true
            }
        #endif

        setupWebView(webView)

        return webView
    }()

    private static func setupWebView(_ webView: WKWebView) {
        let delegate = WebViewDelegate(state: state)
        webView.navigationDelegate = delegate

        let script = WKUserScript(
            source: """
                    window.addEventListener('load', function() {
                        window.webkit.messageHandlers.contentHeight.postMessage(document.documentElement.scrollHeight);
                    });
                    const observer = new ResizeObserver(function() {
                        window.webkit.messageHandlers.contentHeight.postMessage(document.documentElement.scrollHeight);
                    });
                    observer.observe(document.documentElement);
                """,
            injectionTime: .atDocumentEnd,
            forMainFrameOnly: true
        )

        webView.configuration.userContentController.addUserScript(script)
        webView.configuration.userContentController.add(delegate, name: "contentHeight")
    }

    static func resetWebView() {
        let newWebView = WKWebView(frame: .zero, configuration: WKWebViewConfiguration())
        setupWebView(newWebView)
        shared = newWebView
    }
}

// MARK: - WebViewState
private class WebViewDelegate: NSObject, WKNavigationDelegate, WKScriptMessageHandler {
    private let state: WebViewState

    init(state: WebViewState) {
        self.state = state
        super.init()
    }

    func userContentController(
        _ userContentController: WKUserContentController, didReceive message: WKScriptMessage
    ) {
        if message.name == "contentHeight", let height = message.body as? CGFloat {
            DispatchQueue.main.async {
                self.state.contentHeight = height
            }
        }
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        webView.evaluateJavaScript("document.documentElement.scrollHeight") { (height, error) in
            if let height = height as? CGFloat {
                DispatchQueue.main.async {
                    self.state.contentHeight = height
                }
            }
        }
    }

}
