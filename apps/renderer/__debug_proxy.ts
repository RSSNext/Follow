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
