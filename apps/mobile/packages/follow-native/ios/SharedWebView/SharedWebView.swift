import ExpoModulesCore
import SwiftUI
import WebKit

class WebViewComponentView: ExpoView {
  var webView: WKWebView

  required init(appContext: AppContext? = nil) {
    webView = SharedWebViewModule.sharedWebView ?? WKWebView()
      super.init(appContext: appContext)
        
    }

    var body: some View {
        WebViewComponent(webView: webView)
    }
}

struct WebViewComponent: UIViewRepresentable {
    let webView: WKWebView

    func makeUIView(context: Context) -> WKWebView {
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}
}
