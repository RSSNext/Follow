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

  #if RCT_NEW_ARCH_ENABLED

    override func mountChildComponentView(_ childComponentView: UIView, index: Int) {
      self.insertSubview(childComponentView, at: index)
    }

    override func unmountChildComponentView(_ childComponentView: UIView, index: Int) {
      self.willRemoveSubview(childComponentView)
      //      gestureRecognizers?.removeAll()

    }
  #endif

  public func switchToTab(index: Int) {
    let beforeIndex = tabBarController.selectedIndex
    if beforeIndex == index {
      return
    }

    if tabViewControllers.count < beforeIndex || tabViewControllers.count < index {
      return
    }
    if let fromView = tabViewControllers[beforeIndex].view,
      let toView = tabViewControllers[index].view
    {
      if fromView != toView {
        UIView.transition(
          from: fromView,
          to: toView,
          duration: 0.1,
          options: [.transitionCrossDissolve, .preferredFramesPerSecond60],
          completion: nil)
      }
    }

    tabBarController.selectedIndex = index
    if let selectedViewController = tabBarController.selectedViewController {
      tabBarController(tabBarController, didSelect: selectedViewController)
    }

  }

  override func insertSubview(_ subview: UIView, at atIndex: Int) {

    if let tabScreenView = subview as? TabScreenView {

      let screenVC = UIViewController()
      screenVC.view = tabScreenView
      tabViewControllers.append(screenVC)
      tabBarController.viewControllers = tabViewControllers
      tabBarController.didMove(toParent: vc)
    }

    if let tabBarPortalView = subview as? TabBarPortalView {
      let tabBarView = self.tabBarController.view!
      tabBarView.addSubview(tabBarPortalView)

    }
  }

  override func willRemoveSubview(_ subview: UIView) {
    if let tabScreenView = subview as? TabScreenView {
      tabViewControllers.removeAll { viewController in
        return viewController.view == tabScreenView
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

  // func tabBarController(
  //   _ tabBarController: UITabBarController,
  //   animationControllerForTransitionFrom fromVC: UIViewController, to toVC: UIViewController
  // ) -> (any UIViewControllerAnimatedTransitioning)? {

  //   return nil
  // }

}
