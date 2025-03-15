//
//  FOTabBarController.swift
//  FollowNative
//
//  Created by Innei on 2025/3/16.
//
import UIKit
import ExpoModulesCore

class FOTabBarController: UITabBarController {
    override func viewDidLoad() {
        super.viewDidLoad()
        self.tabBar.isHidden = true
    }
  
     func switchTab(_ tabIndex: Int, promise: Promise) {
        if tabIndex >= 0 && tabIndex < viewControllers?.count ?? 0 {
          self.selectedIndex = tabIndex
          promise.resolve()
        } else {
          promise.reject("INVALID_SCREEN_ID", "Invalid index")
        }
    }
}
