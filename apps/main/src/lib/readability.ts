import { Readability } from "@mozilla/readability"
import { name, version } from "@pkg"
import DOMPurify from "dompurify"
import { parseHTML } from "linkedom"
import { fetch } from "ofetch"

import { isDev } from "~/env"

const userAgents = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 ${name}/${version}`

// For avoiding xss attack from readability, the raw document string should be sanitized.
// The xss attack in electron may lead to more serious outcomes than browser environment.
// It may allows remotely execute malicious scripts in main process.
// Before the sanitizing, the DOMPurify requires a `window` environment provided by linkedom.
function sanitizeHTMLString(dirtyDocumentString: string) {
  const parser = parseHTML(dirtyDocumentString)
  const purify = DOMPurify(parser.window)
  // How do DOMPurify changes the origin html structure,
  // You can refer its document https://github.com/cure53/DOMPurify?tab=readme-ov-file#can-i-configure-dompurify
  const sanitizedDocumentString = purify.sanitize(dirtyDocumentString)
  return sanitizedDocumentString
}

export async function readability(url: string) {
  const dirtyDocumentString = await fetch(url, {
    headers: {
      "User-Agent": userAgents,
      Accept: "text/html",
    },
  })
    .then(async (res) => {
      // Get the Content-Type and character set from the response header
      const contentType = res.headers.get("content-type")
      const httpCharset = contentType?.match(/charset=([\w-]+)/i)?.[1]

      // Reading an ArrayBuffer in one go
      const buffer = await res.arrayBuffer()

      // By default, the character set in the HTTP response header or UTF-8 is used
      const charset = httpCharset || "utf-8"
      const text = new TextDecoder(charset, { fatal: false }).decode(buffer)

      return { buffer, text, charset }
    })
    .then((res) => {
      /*eslint prefer-const: "warn"*/
      let { buffer, text, charset } = res
      // Try parsing the <meta> charset in the text
      try {
        const { document } = parseHTML(text)
        const metaCharset =
          document.querySelector("meta[charset]")?.getAttribute("charset") ||
          document
            .querySelector('meta[http-equiv="Content-Type"]')
            ?.getAttribute("content")
            ?.match(/charset=([\w-]+)/i)?.[1]

        // If <meta> charset and HTTP charset are inconsistent, re-decode
        if (metaCharset && metaCharset.toLowerCase() !== charset.toLowerCase()) {
          charset = metaCharset
          text = new TextDecoder(charset, { fatal: false }).decode(buffer)
        }
        return text
      } catch {
        return text // Fallback origin content if it's failed
      }
    })
    .catch(() => {
      return ""
    })

  const sanitizedDocumentString = sanitizeHTMLString(dirtyDocumentString)
  const baseUrl = new URL(url).origin

  // FIXME: linkedom does not handle relative addresses in strings. Refer to
  // @see https://github.com/WebReflection/linkedom/issues/153
  // JSDOM handles it correctly, but JSDOM introduces canvas binding.
  const { document } = parseHTML(sanitizedDocumentString)

  document.querySelectorAll("a").forEach((a) => {
    a.href = replaceRelativeAddress(baseUrl, a.href)
  })
  ;(["img", "audio", "video"] as const).forEach((tag) => {
    document.querySelectorAll(tag).forEach((img) => {
      img.src = img.src && replaceRelativeAddress(baseUrl, img.src)
    })
  })

  const reader = new Readability(document, {
    debug: isDev,
    // keep classes to set the right code language
    // https://github.com/RSSNext/Follow/issues/1058
    keepClasses: true,
  })
  return reader.parse()
}

const replaceRelativeAddress = (baseUrl: string, url: string) => {
  if (url.startsWith("http")) {
    return url
  }
  return new URL(url, baseUrl).href
}
