//
//  TabBarRootView.swift
//  FollowNative
//
//  Created by Innei on 2025/3/16.
//

import Foundation
import ExpoModulesCore
import SnapKit

class TabBarRootView: ExpoView {
  private var tabBar: FOTabBarController? = nil
  private var tabbarView: UIView? = nil

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    tabBar = FOTabBarController.init(nibName: "follow", bundle: .main)
    
   
    let subView = tabBar!.view
    tabbarView = subView
    addSubview(subView!)
    subView!.snp.makeConstraints { make in
      make.edges.equalToSuperview()
    }

  }
  
  override func insertSubview(_ subview: UIView, at atIndex: Int) {
    super.insertSubview(subview, at: atIndex)
    self.subviews.forEach { view in
      
      if view != tabbarView {
        view.removeFromSuperview()
        self.tabbarView?.addSubview(view)
      }
      
    }
    
    
  }
  
 
}
