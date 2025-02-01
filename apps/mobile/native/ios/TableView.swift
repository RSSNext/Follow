//
//  TableView.swift
//  FollowNative
//
//  Created by Innei on 2025/1/29.
//

import ExpoModulesCore
import UIKit

class FOTableView: ExpoView, UITableViewDataSource, UITableViewDelegate {
    var tableView: UITableView!

    let data = [
        "苹果", "香蕉", "橙子", "葡萄", "蓝莓", "草莓", "西瓜",
    ]
    required init(appContext: AppContext? = nil) {
        super.init(appContext: appContext)

      tableView = UITableView(frame: UIScreen.main.bounds)
        addSubview(tableView)

        tableView.dataSource = self
        tableView.delegate = self
        // 注册 UITableViewCell
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "Cell")

        // 添加 tableView 到主视图
        addSubview(tableView)
    }

    // UITableViewDataSource 方法
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return data.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "Cell", for: indexPath)

        // 配置每一行的内容
        cell.textLabel?.text = data[indexPath.row]

        return cell
    }
}
