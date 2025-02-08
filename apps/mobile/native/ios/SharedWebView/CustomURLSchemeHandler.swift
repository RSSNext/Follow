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
    private let queue = DispatchQueue(label: "com.follow.urlschemehandler")
    private var activeTasks: [String: URLSessionDataTask] = [:]

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

            // Check if task is still active
            guard self.activeTasks[taskID] != nil else { return }

            if let error = error {
                urlSchemeTask.didFailWithError(error)
                self.queue.sync {
                    self.activeTasks.removeValue(forKey: taskID)
                }
                return
            }

            if let response = response as? HTTPURLResponse, let data = data {
                do {
                    urlSchemeTask.didReceive(response)
                    urlSchemeTask.didReceive(data)
                    urlSchemeTask.didFinish()
                } catch {
                    // Ignore errors that might occur if task was stopped
                    print("Error completing URL scheme task: \(error)")
                }
            }
            self.activeTasks.removeValue(forKey: taskID)
        }
        queue.sync {
            activeTasks[taskID] = task
        }

        task.resume()
    }

    func webView(_ webView: WKWebView, stop urlSchemeTask: WKURLSchemeTask) {
        let taskID = urlSchemeTask.description
        queue.sync {
            if let task = activeTasks[taskID] {
                task.cancel()
                activeTasks.removeValue(forKey: taskID)
            }
        }
    }
}
