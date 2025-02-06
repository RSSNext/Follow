import Combine
import ExpoModulesCore
import SnapKit
import SwiftUI
import WebKit

class WebViewView: ExpoView {
    private var cancellable: AnyCancellable?
    private let rctView = RCTView(frame: .zero)

    required init(appContext: AppContext? = nil) {
        super.init(appContext: appContext)
        addSubview(rctView)

        #if DEBUG
            rctView.borderStyle = .solid
            rctView.borderWidth = 1
            rctView.borderColor = .systemBlue
        // var debugButton = DebugButton()

        // if let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
        //     let window = scene.windows.first
        // {
        //   window.addSubview(debugButton)
        //   debugButton.setupConstraints(in: window)
        // }
        #endif
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

    }
}

#if DEBUG
    class DebugButton: UIButton {
        override init(frame: CGRect) {
            super.init(frame: CGRect(x: 10, y: 0, width: 0, height: 30))
            setupButton()
        }

        required init?(coder: NSCoder) {
            super.init(coder: coder)
            setupButton()
        }
      
        private func setupButton() {
            setTitle("Online", for: .normal)
            backgroundColor = .systemGreen
            layer.cornerRadius = 15
            layer.zPosition = 999

            addTarget(self, action: #selector(buttonTouchDown), for: .touchDown)
            addTarget(
                self, action: #selector(buttonTouchUp),
                for: [.touchUpInside, .touchUpOutside, .touchCancel])
            addTarget(self, action: #selector(buttonPressed), for: .touchUpInside)
        }

        func setupConstraints(in window: UIWindow) {
            snp.makeConstraints { make in
                make.left.equalTo(window).offset(10)
                make.bottom.equalTo(window.safeAreaLayoutGuide).offset(-10)
                make.width.equalTo(80)
                make.height.equalTo(30)
            }
        }

        @objc private func buttonTouchDown() {
            UIView.animate(withDuration: 0.1) {
                self.transform = CGAffineTransform(scaleX: 0.95, y: 0.95)
                self.alpha = 0.9
            }
        }

        @objc private func buttonTouchUp() {
            UIView.animate(withDuration: 0.1) {
                self.transform = .identity
                self.alpha = 1.0
            }
        }

        @objc private func buttonPressed() {
            print("Button pressed!")
        }
    }

#endif
