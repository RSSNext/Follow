//
//  TimelineListViewModule.swift
//  FollowNative
//
//  Created by Innei on 2025/2/12.
//

import ExpoModulesCore
import UIKit
import SnapKit

private class TimelineListExpoView : ExpoView {
  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    let timelineListView = TimelineListView()
    // 创建一个自定义 header
    let headerView = UIView(frame: CGRect(x: 0, y: 0, width: UIScreen.main.bounds.width, height: 100))
    headerView.backgroundColor = .red
    // 添加其他子视图到 headerView...
    timelineListView.setHeaderView(headerView)

    // 创建一个自定义 footer
    let footerView = UIView(frame: CGRect(x: 0, y: 0, width: UIScreen.main.bounds.width, height: 80))
    footerView.backgroundColor = .blue
    // 添加其他子视图到 footerView...
    timelineListView.setFooterView(footerView)
    timelineListView.setTopContentInset(88)
    
    addSubview(timelineListView)
    timelineListView.snp.makeConstraints { make in
      make.edges.equalToSuperview()
    }
  }
}

public class TimelineListViewModule: Module {
  public func definition() -> ModuleDefinition {
    Name("TimelineList")
    
    View(TimelineListExpoView.self) {}
  }
}

