//
//  TabBarRootView.swift
//  FollowNative
//
//  Created by Innei on 2025/3/16.
//

import ExpoModulesCore
import Foundation
import SnapKit
 
class TabBarRootView: ExpoView {
  private let tabBarController = UITabBarController()
  private let vc = UIViewController()
  private var tabViewControllers: [UIViewController] = []

  private let onTabIndexChange = EventDispatcher()

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)

    tabBarController.tabBar.isHidden = true
    tabBarController.delegate = self

    addSubview(vc.view)
    vc.addChild(tabBarController)
    vc.view!.snp.makeConstraints { make in
      make.edges.equalToSuperview()
    }
    vc.view.addSubview(tabBarController.view)
    tabBarController.didMove(toParent: vc)

  }

  public func switchToTab(index: Int) {
    tabBarController.selectedIndex = index
    if let selectedViewController = tabBarController.selectedViewController {
      tabBarController(tabBarController, didSelect: selectedViewController)
    }
  }

  override func insertSubview(_ subview: UIView, at atIndex: Int) {
    if let tabScreenView = subview as? TabScreenView {
//      let containerView = UIView(frame: tabScreenView.bounds)
//
//      for subview in tabScreenView.subviews {
//        let copy = subview.snapshotView(afterScreenUpdates: true) ?? UIView()
//        containerView.addSubview(copy)
//        copy.frame = subview.frame
//      }
//
//      let screenVC = UIViewController()
//      screenVC.view = containerView
//
//      screenVC.view.tag = tabScreenView.tag
//
//      tabViewControllers.append(screenVC)
//
//      tabBarController.viewControllers = tabViewControllers
//      tabBarController.didMove(toParent: vc)
//
//      super.insertSubview(tabScreenView, at: atIndex)
//      tabScreenView.isHidden = true
      
      
      // FIXME: it is necessary to let RN know that the position of view has moved, otherwise unmount will report an error.
      
      tabScreenView.removeFromSuperview()
 
      self.removeReactSubview(subview)
      let screenVC = UIViewController()
      screenVC.view = tabScreenView
      screenVC.view.tag = tabScreenView.tag
      tabViewControllers.append(screenVC)
      tabBarController.viewControllers = tabViewControllers
      tabBarController.didMove(toParent: vc)
    }
     
    
    if let tabBarPortalView = subview as? TabBarPortalView {
      let tabBarView = self.tabBarController.view!
      tabBarView.addSubview(tabBarPortalView)
 
    }
  }

  // open override func exchangeSubview(at index1: Int, withSubviewAt index2: Int) {

  // }

  // public override func addSubview(_ view: UIView) {

  // }

  // open override func insertSubview(_ view: UIView, belowSubview siblingSubview: UIView) {

  // }

  // open override func insertSubview(_ view: UIView, aboveSubview siblingSubview: UIView) {

  // }

  // open override func didAddSubview(_ subview: UIView) {

  // }
 
  override func willRemoveSubview(_ subview: UIView) {
    if let tabScreenView = subview as? TabScreenView {
      tabViewControllers.removeAll { viewController in
        return viewController.view.tag == tabScreenView.tag
      }

      tabBarController.viewControllers = tabViewControllers
      tabBarController.didMove(toParent: vc)
    }
  }

}

// MARK: - UITabBarControllerDelegate
extension TabBarRootView: UITabBarControllerDelegate {
  func tabBarController(
    _ tabBarController: UITabBarController, didSelect viewController: UIViewController
  ) {
    onTabIndexChange([
      "index": tabBarController.selectedIndex
    ])
  }
 
}
