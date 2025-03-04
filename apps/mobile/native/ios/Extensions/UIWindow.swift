//
//  UIWindow.swift
//  FollowNative
//
//  Created by Innei on 2025/2/27.
//

import UIKit

extension UIWindow {

    public static func findRNSNavigationController() -> UINavigationController? {

        guard let window = UIApplication.shared.windows.first else {
            return nil
        }

        let rootViewController = window.rootViewController

        if let navController = rootViewController as? UINavigationController,
            NSStringFromClass(type(of: navController)).contains("RNSNavigationController")
        {
            return navController
        }

        return findRNSNavigationControllerInChildren(of: rootViewController)
    }

    private static func findRNSNavigationControllerInChildren(of viewController: UIViewController?)
        -> UINavigationController?
    {
        guard let viewController = viewController else {
            return nil
        }

        if let presentedVC = viewController.presentedViewController {
            if let navController = presentedVC as? UINavigationController,
                NSStringFromClass(type(of: navController)).contains("RNSNavigationController")
            {
                return navController
            }

            if let result = findRNSNavigationControllerInChildren(of: presentedVC) {
                return result
            }
        }

        for childVC in viewController.children {
            if let navController = childVC as? UINavigationController,
                NSStringFromClass(type(of: navController)).contains("RNSNavigationController")
            {
                return navController
            }

            if let result = findRNSNavigationControllerInChildren(of: childVC) {
                return result
            }
        }

        return nil
    }
}
