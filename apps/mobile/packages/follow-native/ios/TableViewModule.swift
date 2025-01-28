//
//  TableViewModule.swift
//  FollowNative
//
//  Created by Innei on 2025/1/29.
//

import ExpoModulesCore

public class TableViewModule: Module {
  public func definition() -> ModuleDefinition {
    Name("FOTableView")
    
    View(FOTableView.self) {       
    }
  }
}
