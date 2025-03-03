//
//  FOWebView.swift
//  FollowNative
//
//  Created by Innei on 2025/2/7.
//

@preconcurrency import WebKit

private var pendingJavaScripts: [String] = []

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

  private var state: WebViewState!

  init(frame: CGRect, state: WebViewState) {
    let configuration = WKWebViewConfiguration()
    self.state = state
    let viewController = Utils.getRootVC()!
 

    super.init(frame: frame, configuration: configuration)

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

    let atStartScripts = loadInjectedJs(forResource: "at_start")

    if let jsString = atStartScripts {
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

    let atEndScripts = self.loadInjectedJs(forResource: "at_end")
    guard let jsString = atEndScripts else {
      print("Failed to load injected js")
      return
    }
    let script2 = WKUserScript(
      source: jsString,
      injectionTime: .atDocumentEnd,
      forMainFrameOnly: true
    )

    configuration.userContentController.add(self, name: "message")
    configuration.userContentController.addUserScript(script2)

    setupView()
    navigationDelegate = self
    uiDelegate = self
  }

  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
}

extension FOWebView {

  private func loadInjectedJs(forResource: String) -> String? {
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

}

extension FOWebView: WKNavigationDelegate, WKScriptMessageHandler, WKUIDelegate
{
 
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

  }

  func webView(
    _ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration,
    for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures
  ) -> WKWebView? {
    if let url = navigationAction.request.url,
      let viewController = Utils.getRootVC()
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
         let viewController = Utils.getRootVC()
      {
        WebViewManager.presentModalWebView(url: url, from: viewController)
        decisionHandler(.cancel)
        return
      }
    }
    decisionHandler(.allow)
  }
}
