//
//  at_end.js
//  Pods
//
//  Created by Innei on 2025/2/6.
//

const root = document.querySelector("#root")
const handleHeight = () => {
  window.webkit.messageHandlers.contentHeight.postMessage(root.scrollHeight)
}
window.addEventListener("load", handleHeight)
const observer = new ResizeObserver(handleHeight)

setTimeout(() => {
  handleHeight()
}, 1000)
observer.observe(root)
