//
//  WebViewController.swift
//  FollowNative
//
//  Created by Innei on 2025/2/27.
//

import Foundation
import SnapKit
import UIKit
import WebKit

class WebViewController: UIViewController {
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

    setupWebView()
    setupToolbar()
    loadContent()
    setupInteractivePopGesture()
  }

  private func setupInteractivePopGesture() {
    navigationController?.interactivePopGestureRecognizer?.delegate = self
    navigationController?.interactivePopGestureRecognizer?.isEnabled = true
  }

  private func setupWebView() {
    view.addSubview(webView)
    view.backgroundColor = .systemBackground
    webView.snp.makeConstraints { make in
      make.top.equalTo(view.safeAreaLayoutGuide)
      make.left.right.bottom.equalToSuperview()
    }
  }

  private func setupToolbar() {
    // 确保导航控制器显示工具栏
    navigationController?.isToolbarHidden = false

    // 创建工具栏按钮
    let backButton = UIBarButtonItem(
      image: UIImage(systemName: "chevron.backward"), style: .plain, target: self,
      action: #selector(goBack))
    backButton.tintColor = Utils.accentColor

    let forwardButton = UIBarButtonItem(
      image: UIImage(systemName: "chevron.forward"), style: .plain, target: self,
      action: #selector(goForward))
    forwardButton.tintColor = Utils.accentColor

    let refreshButton = UIBarButtonItem(
      barButtonSystemItem: .refresh, target: self, action: #selector(refreshPage))
    refreshButton.tintColor = Utils.accentColor

    let safariButton = UIBarButtonItem(
      image: UIImage(systemName: "safari"), style: .plain, target: self,
      action: #selector(openInSafari))
    safariButton.tintColor = Utils.accentColor

    // 添加弹性空间使按钮均匀分布
    let flexSpace = UIBarButtonItem(barButtonSystemItem: .flexibleSpace, target: nil, action: nil)

    // 设置工具栏项目
    toolbarItems = [
      flexSpace, backButton, flexSpace, forwardButton, flexSpace, refreshButton, flexSpace,
      safariButton, flexSpace,
    ]
  }

  private func loadContent() {
    let request = URLRequest(url: url)
    webView.load(request)
  }

  @objc private func openInSafari() {
    UIApplication.shared.open(url)
  }

  @objc private func goBack() {
    if webView.canGoBack {
      webView.goBack()
    }
  }

  @objc private func goForward() {
    if webView.canGoForward {
      webView.goForward()
    }
  }

  @objc private func refreshPage() {
    webView.reload()
  }
}

// MARK: - WKNavigationDelegate
extension WebViewController: WKNavigationDelegate {
  func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
    navigationItem.title = webView.title

    // 更新后退/前进按钮状态
    updateToolbarButtonsState()
  }

  func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
    // 更新后退/前进按钮状态
    updateToolbarButtonsState()
  }

  private func updateToolbarButtonsState() {
    // 找到后退和前进按钮并更新它们的启用状态
    if let items = toolbarItems {
      // 后退按钮在索引1
      if let backButton = items[1] as? UIBarButtonItem {
        backButton.isEnabled = webView.canGoBack
      }

      // 前进按钮在索引3
      if let forwardButton = items[3] as? UIBarButtonItem {
        forwardButton.isEnabled = webView.canGoForward
      }
    }
  }
}

// MARK: - UIGestureRecognizerDelegate
extension WebViewController: UIGestureRecognizerDelegate {
  func gestureRecognizerShouldBegin(_ gestureRecognizer: UIGestureRecognizer) -> Bool {
    return true
  }
}
