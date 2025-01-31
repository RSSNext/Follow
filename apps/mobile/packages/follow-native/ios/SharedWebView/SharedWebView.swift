import Combine
import ExpoModulesCore
import SwiftUI
import WebKit

class WebViewProps: ExpoSwiftUI.ViewProps {
    @Field var url: String
}

struct WebViewComponentView: ExpoSwiftUI.View {
    @EnvironmentObject var props: WebViewProps
    @StateObject private var webViewState = WebViewManager.state

    let webView: WKWebView = SharedWebViewModule.sharedWebView!

    var body: some View {
        WebViewComponent(webView: webView)
            .frame(
                height: webViewState.contentHeight
            )

            .onChange(of: props.url, initial: false) { _, newValue in
                if let nextUrl = URL(string: newValue) {
                    let request = URLRequest(url: nextUrl)
                    webView.load(request)
                }
            }
        #if DEBUG
            .border(.tint)
        #endif
    }
}

class WebViewView: ExpoView {
    private var cancellable: AnyCancellable?

    private let rctView = ExpoModulesCore.RCTView(frame: .zero)

    required init(appContext: AppContext? = nil) {
        super.init(appContext: appContext)
        addSubview(rctView)
        rctView.addSubview(SharedWebViewModule.sharedWebView!)

        clipsToBounds = true

        cancellable = WebViewManager.state.$contentHeight
            .receive(on: DispatchQueue.main)
            .sink { [weak self] _ in
                self?.layoutSubviews()
            }
    }

    deinit {
        cancellable?.cancel()
    }

    private let onContentHeightChange = ExpoModulesCore.EventDispatcher()

    override func layoutSubviews() {
        let rect = CGRect(
            x: bounds.origin.x,
            y: bounds.origin.y,
            width: bounds.width,
            height: WebViewManager.state.contentHeight
        )

        SharedWebViewModule.sharedWebView!.frame = rect

        frame = rect

        rctView.frame = rect

      onContentHeightChange(["height": Float(rect.height)])
//      if let superview = self.superview {
//        superview.frame = rect
//
//        if let superSuperview = superview.superview {
//          superSuperview.frame = rect
//        }
//        }
    }
}

struct WebViewComponent: UIViewRepresentable {
    let webView: WKWebView

    func makeUIView(context: Context) -> WKWebView {
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}
}
