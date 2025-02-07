//
//  SharedWebView+BridgeData.swift
//  Pods
//
//  Created by Innei on 2025/2/7.
//
import Foundation

private protocol BasePayload {
  var type: String { get }
}

struct SetContentHeightPayload: Hashable, Codable, BasePayload {
  var type: String
  var payload: CGFloat
}

struct BridgeDataBasePayload: Hashable, Codable {
  var type: String
}
