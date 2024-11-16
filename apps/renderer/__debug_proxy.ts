const host = "https://localhost:2233"

globalThis["__DEBUG_PROXY__"] = true

fetch(`${host}`)
  .then((res) => res.text())
  .then((html) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")

    const scripts = doc.querySelectorAll("script")

    scripts.forEach((script) => {
      script.remove()
    })

    // header meta

    const $meta = doc.head.querySelectorAll("meta")
    $meta.forEach((meta) => {
      document.head.append(meta)
    })

    const $style = doc.head.querySelectorAll("style")
    $style.forEach((style) => {
      document.head.append(style)
    })

    document.body.innerHTML = doc.body.innerHTML

    scripts.forEach((script) => {
      const $script = document.createElement("script")
      $script.type = "module"
      $script.crossOrigin = script.crossOrigin

      if (script.src) {
        $script.src = new URL(
          script.src.startsWith("http") ? new URL(script.src).pathname : script.src,
          host,
        ).toString()
      } else if (script.innerHTML) {
        $script.innerHTML = script.innerHTML
      } else {
        return
      }

      document.body.append($script)
    })
  })

const injectScript = (apiUrl: string) => {
  const upstreamOrigin = window.location.origin
  const template = `function injectEnv(env2) {
for (const key in env2) {
if (env2[key] === void 0) continue;
globalThis["__followEnv"] ??= {};
globalThis["__followEnv"][key] = env2[key];
}
}
injectEnv({"VITE_API_URL":"${apiUrl}","VITE_EXTERNAL_API_URL":"${apiUrl}","VITE_WEB_URL":"${upstreamOrigin}"})`
  const $script = document.createElement("script")
  $script.innerHTML = template
  document.head.prepend($script)
}

const apiMap = {
  "https://dev.follow.is": "https://api.dev.follow.is",
  "https://app.follow.is": "https://api.follow.is",
}
injectScript(apiMap[window.location.origin])
