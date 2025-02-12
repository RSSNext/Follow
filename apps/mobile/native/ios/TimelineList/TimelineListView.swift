//
//  TimelineListView.swift
//  Pods
//
//  Created by Innei on 2025/2/12.
//

import Combine
import UIKit


// 创建一个更复杂的数据结构来存储条目信息
struct TimelineItem {
  let title: String
  let description: String
  let date: Date
  let imageUrl: String?
}

// 添加在 TimelineListView 类之前
protocol TimelineListViewDelegate: AnyObject {
  func timelineListView(_ listView: TimelineListView, didChangeVisibleItems items: [TimelineItem])
}

class TimelineListView: UITableView, UITableViewDataSource, UIScrollViewDelegate, UITableViewDelegate {
  // 添加代理属性
  weak var timelineDelegate: TimelineListViewDelegate?

  // 创建一个 PassthroughSubject 用于发送可见项变化事件
  private let visibleItemsSubject = PassthroughSubject<[TimelineItem], Never>()

  // 提供一个公开的 publisher 供订阅
  var visibleItemsPublisher: AnyPublisher<[TimelineItem], Never> {
    visibleItemsSubject.eraseToAnyPublisher()
  }

  // 添加节流控制属性
  private var lastVisibleItemsUpdate: TimeInterval = 0
  private let minimumUpdateInterval: TimeInterval = 0.1  // 100ms


  private var items: [TimelineItem] = [] {
    didSet {
      notifyVisibleItemsIfNeeded()
    }
  }

  // 添加自定义 header 和 footer 视图的属性
  private var customHeaderView: UIView? {
    didSet {
      if let header = customHeaderView {
        tableHeaderView = header
      }
    }
  }

  private var customFooterView: UIView? {
    didSet {
      if let footer = customFooterView {
        tableFooterView = footer
      }
    }
  }

  // 添加顶部偏移量属性
  private var topInset: CGFloat = 0 {
    didSet {
      // 更新 contentInset
      var newInset = contentInset
      newInset.top = topInset
      contentInset = newInset

      // 同时更新滚动条的位置
      scrollIndicatorInsets = contentInset
    }
  }

  // 添加设置 header 和 footer 的方法
  func setHeaderView(_ view: UIView) {
    customHeaderView = view
  }

  func setFooterView(_ view: UIView) {
    customFooterView = view
  }

  // 移除 header 或 footer
  func removeHeaderView() {
    customHeaderView = nil
    tableHeaderView = nil
  }

  func removeFooterView() {
    customFooterView = nil
    tableFooterView = nil
  }

  // 提供设置顶部偏移的公共方法
  func setTopContentInset(_ inset: CGFloat) {
    topInset = inset
  }

  func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
    return items.count
  }

  func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    let cell =
      tableView.dequeueReusableCell(withIdentifier: "TimelineCell", for: indexPath) as! TimelineCell
    let item = items[indexPath.row]
    cell.configure(
      title: item.title,
      description: item.description,
      date: item.date,
      imageUrl: item.imageUrl
    )
    return cell
  }

  init() {
    super.init(frame: .zero, style: .plain)

    clipsToBounds = false
    estimatedRowHeight = 44
    rowHeight = UITableView.automaticDimension

    // 设置默认的 contentInset，防止内容被遮挡
    contentInset = UIEdgeInsets(top: 0, left: 0, bottom: 0, right: 0)

    // 设置滚动条的位置，与 contentInset 保持一致
    scrollIndicatorInsets = contentInset

    register(TimelineCell.self, forCellReuseIdentifier: "TimelineCell")
    dataSource = self

    // 示例标题和描述数组
    let sampleTitles = [
      "iOS 开发技巧与最佳实践",
      "Swift 性能优化指南",
      "SwiftUI 动画详解",
      "Core Data 深度探索",
      "iOS 应用安全指南",
      "Swift 函数式编程",
      "iOS 网络编程实战",
      "ARKit 开发入门",
      "iOS 自动化测试",
      "Swift Package Manager 使用指南",
    ]

    let sampleDescriptions = [
      "深入探讨iOS开发中的关键概念和技术要点",
      "学习如何优化Swift代码以提高应用性能",
      "掌握创建流畅用户界面的核心技术",
      "数据持久化和数据库管理的最佳实践",
      "了解移动应用安全性的重要性和实现方法",
      "探索Swift中的函数式编程范式",
      "构建稳定可靠的网络通信功能",
      "开发增强现实应用的基础知识",
      "编写高质量的单元测试和UI测试",
      "包管理和模块化开发的现代方法",
    ]

    // 生成1000条随机数据
    items = (0..<1000).map { index in
      let randomTitleIndex = Int.random(in: 0..<sampleTitles.count)
      let randomDescIndex = Int.random(in: 0..<sampleDescriptions.count)
      let randomTimeInterval = Double.random(in: -2_592_000...0)  // 随机时间范围：30天内
      let hasImage = Bool.random()

      return TimelineItem(
        title: "\(sampleTitles[randomTitleIndex]) #\(index + 1)",
        description: sampleDescriptions[randomDescIndex],
        date: Date().addingTimeInterval(randomTimeInterval),
        imageUrl: hasImage ? "https://picsum.photos/\(200 + index % 100)" : nil
      )
    }

    // 按日期排序（最新的在前）
    items.sort { $0.date > $1.date }

    // 设置自己为 scrollView delegate
    delegate = self
  }

  @available(*, unavailable)
  required init?(coder _: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  // 实现 UIScrollViewDelegate 方法来监听滚动
  func scrollViewDidScroll(_ scrollView: UIScrollView) {
    notifyVisibleItemsIfNeeded()
  }

  // 更新通知方法，使用 Combine 发送事件
  private func notifyVisibleItemsIfNeeded() {
    let now = Date().timeIntervalSince1970

    // 检查是否需要节流
    guard now - lastVisibleItemsUpdate >= minimumUpdateInterval else {
      return
    }

    lastVisibleItemsUpdate = now

    // 获取可见的 cells 对应的 items
    let visibleIndexPaths = indexPathsForVisibleRows ?? []
    let visibleItems = visibleIndexPaths.map { items[$0.row] }

    // 发送事件
    visibleItemsSubject.send(visibleItems)
  }

 

  // 添加更新数据的公共方法
  func updateItems(_ newItems: [TimelineItem]) {
    items = newItems
    reloadData()
  }
}
