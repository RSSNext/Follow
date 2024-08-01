import { Readability } from "@mozilla/readability"
import { name, version } from "@pkg"
import { parseHTML } from "linkedom"
import { fetch } from "ofetch"

import { isDev } from "../env"

const userAgents = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 ${name}/${version}`

export async function readability(url: string) {
  const documentString = await fetch(url, {
    headers: {
      "User-Agent": userAgents,
    },
  }).then((res) => res.text())

  // FIXME: linkedom does not handle relative addresses in strings. Refer to
  // @see https://github.com/WebReflection/linkedom/issues/153
  // JSDOM handles it correctly, but JSDOM introduces canvas binding.
  const reader = new Readability(parseHTML(documentString).document, {
    debug: isDev,
  })
  return reader.parse()
}
