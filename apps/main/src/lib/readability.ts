import { Readability } from "@mozilla/readability"
import { name, version } from "@pkg"
import { parseHTML } from "linkedom"
import { fetch } from "ofetch"

const userAgents = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 ${name}/${version}`

export async function readability(url: string) {
  const documentString = await fetch(url, {
    headers: {
      "User-Agent": userAgents,
      Accept: "text/html",
    },
  }).then(async (res) => {
    const contentType = res.headers.get("content-type")
    // text/html; charset=GBK
    if (!contentType) return res.text()
    const charset = contentType.match(/charset=([^;]+)/)?.[1]
    if (charset) {
      const blob = await res.blob()
      const buffer = await blob.arrayBuffer()
      return new TextDecoder(charset).decode(buffer)
    }
    return res.text()
  })

  // FIXME: linkedom does not handle relative addresses in strings. Refer to
  // @see https://github.com/WebReflection/linkedom/issues/153
  // JSDOM handles it correctly, but JSDOM introduces canvas binding.

  const { document } = parseHTML(documentString)
  const baseUrl = new URL(url).origin

  document.querySelectorAll("a").forEach((a) => {
    a.href = replaceRelativeAddress(baseUrl, a.href)
  })
  ;(["img", "audio", "video"] as const).forEach((tag) => {
    document.querySelectorAll(tag).forEach((img) => {
      img.src = img.src && replaceRelativeAddress(baseUrl, img.src)
    })
  })

  const reader = new Readability(document, {
    // debug: isDev,
  })
  return reader.parse()
}

const replaceRelativeAddress = (baseUrl: string, url: string) => {
  if (url.startsWith("http")) {
    return url
  }
  return new URL(url, baseUrl).href
}
