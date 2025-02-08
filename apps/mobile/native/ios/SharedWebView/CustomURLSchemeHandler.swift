//
//  CustomURLSchemeHandler.swift
//  Pods
//
//  Created by Innei on 2025/2/7.
//

import Foundation
import WebKit

class CustomURLSchemeHandler: NSObject, WKURLSchemeHandler {
    static let rewriteScheme = "follow-xhr"
    private var activeTasks: [String: URLSessionDataTask] = [:]
    private var stoppedTasks: Set<String> = []

    func webView(_ webView: WKWebView, start urlSchemeTask: WKURLSchemeTask) {
        guard let url = urlSchemeTask.request.url,
            let originalURLString = url.absoluteString.replacingOccurrences(
                of: CustomURLSchemeHandler.rewriteScheme, with: "https"
            ).removingPercentEncoding,
            let originalURL = URL(string: originalURLString)
        else {
            urlSchemeTask.didFailWithError(NSError(domain: "", code: -1))
            return
        }

        var request = URLRequest(url: originalURL)

        request.httpMethod = urlSchemeTask.request.httpMethod
        request.httpBody = urlSchemeTask.request.httpBody

        // setting headers
        var headers = urlSchemeTask.request.allHTTPHeaderFields ?? [:]
        if let urlComponents = URLComponents(url: originalURL, resolvingAgainstBaseURL: false),
            let scheme = urlComponents.scheme,
            let host = urlComponents.host
        {
            let origin = "\(scheme)://\(host)\(urlComponents.port.map { ":\($0)" } ?? "")"
            headers["Referer"] = origin
            headers["Origin"] = origin

        }
        request.allHTTPHeaderFields = headers

        let taskID = urlSchemeTask.description

        let task = URLSession.shared.dataTask(with: request) { [weak self] data, response, error in
            guard let self = self else { return }

            DispatchQueue.main.async {

                guard !self.stoppedTasks.contains(taskID) else { return }

                if let error = error {
                    urlSchemeTask.didFailWithError(error)
                    self.activeTasks.removeValue(forKey: taskID)
                    return
                }

                if let response = response as? HTTPURLResponse, let data = data {
                    guard !self.stoppedTasks.contains(taskID) else { return }

                    var newHeaders = response.allHeaderFields as? [String: String] ?? [:]
                    newHeaders["Access-Control-Allow-Origin"] = "*"
                    newHeaders["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
                    newHeaders["Access-Control-Allow-Headers"] = "*"

                    let modifiedResponse = HTTPURLResponse(
                        url: response.url!,
                        statusCode: response.statusCode,
                        httpVersion: "HTTP/1.1",
                        headerFields: newHeaders
                    )!

                    urlSchemeTask.didReceive(modifiedResponse)
                    urlSchemeTask.didReceive(data)
                    urlSchemeTask.didFinish()

                    self.activeTasks.removeValue(forKey: taskID)
                }
            }
        }

        activeTasks[taskID] = task
        task.resume()
    }

    func webView(_ webView: WKWebView, stop urlSchemeTask: WKURLSchemeTask) {
        let taskID = urlSchemeTask.description
        if let task = activeTasks[taskID] {
            stoppedTasks.insert(taskID)
            task.cancel()
            activeTasks.removeValue(forKey: taskID)
        }
    }
}
