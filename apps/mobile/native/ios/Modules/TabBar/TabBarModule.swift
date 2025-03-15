//
//  TabBarModule.swift
//  FollowNative
//
//  Created by Innei on 2025/3/16.
//

import ExpoModulesCore

public class TabBarModule: Module {

    public func definition() -> ModuleDefinition {
        Name("TabBarRoot")

//        AsyncFunction("switchTab") { (index: Int, promise: Promise) in
//            if let tabBarController = self.tabBarController {
//              tabBarController.switchTab(index, promise: promise)
//            } else {
//                promise.reject("NO_TAB_CONTROLLER", "TabBarController not initialized")
//            }
//        }

      View(TabBarRootView.self) {
        
      }
    }
}
