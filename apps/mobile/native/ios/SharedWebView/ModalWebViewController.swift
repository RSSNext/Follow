import SnapKit
import UIKit
import WebKit

class ModalWebViewController: UIViewController {
    private let webView: WKWebView
    private let url: URL

    init(url: URL) {
        self.url = url

        let configuration = WKWebViewConfiguration()

        self.webView = WKWebView(frame: .zero, configuration: configuration)
        super.init(nibName: nil, bundle: nil)

        webView.navigationDelegate = self
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        setupNavigationBar()
        setupWebView()
        loadContent()
    }

    private func setupNavigationBar() {
        let closeButton = UIBarButtonItem(
            barButtonSystemItem: .close,
            target: self,
            action: #selector(closeModal)
        )

        let safariButton = UIBarButtonItem(
            image: UIImage(systemName: "safari"),
            style: .plain,
            target: self,
            action: #selector(openInSafari)
        )
        safariButton.tintColor = Utils.accentColor

        navigationItem.leftBarButtonItem = closeButton
        navigationItem.rightBarButtonItem = safariButton

        let appearance = UINavigationBarAppearance()
        appearance.configureWithDefaultBackground()
        navigationController?.navigationBar.standardAppearance = appearance
        navigationController?.navigationBar.scrollEdgeAppearance = appearance
    }

    private func setupWebView() {
        view.addSubview(webView)
        webView.snp.makeConstraints { make in
            make.top.equalTo(view.safeAreaLayoutGuide)
            make.left.right.bottom.equalToSuperview()
        }
    }

    private func loadContent() {
        let request = URLRequest(url: url)
        webView.load(request)
    }

    @objc private func closeModal() {
        dismiss(animated: true)
    }

    @objc private func openInSafari() {
        UIApplication.shared.open(url)
    }
}

// MARK: - WKNavigationDelegate
extension ModalWebViewController: WKNavigationDelegate {
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        navigationItem.title = webView.title
    }
}
