import { session } from "electron"

import { logger } from "../logger"
import { store } from "./store"

// Sets up the proxy configuration for the app.
//
// See https://www.electronjs.org/docs/latest/api/session#sessetproxyconfig
// for more information about the proxy API.
//
// The open-source project [poooi/poi](https://github.com/poooi/poi) is doing well in proxy configuration
// refer the following files for more details:
//
// https://github.com/poooi/poi/blob/5741d0d02c0a08626dd53196b094223457014491/lib/proxy.ts#L36
// https://github.com/poooi/poi/blob/5741d0d02c0a08626dd53196b094223457014491/views/components/settings/network/index.es

const URL_SCHEME = new Set(["http", "https", "ftp", "socks", "socks4", "socks5"])

const normalizeProxyUri = (userProxy: string) => {
  if (!userProxy) {
    return
  }
  try {
    const proxyUrl = new URL(userProxy)
    if (!URL_SCHEME.has(proxyUrl.protocol) || !proxyUrl.host || !proxyUrl.port) {
      logger.error(`Invalid proxy URL: ${userProxy}`)
      return
    }
    // There are multiple ways to specify a proxy in Electron,
    // but for security reasons, we only support simple proxy URLs for now.
    return [
      `${proxyUrl.protocol}//${proxyUrl.host}:${proxyUrl.port}`,
      // Failing over to using no proxy if the proxy is unavailable
      "direct://",
    ].join(",")
  } catch {
    logger.error(`Invalid proxy URL: ${userProxy}`)
    return
  }
}

const BYPASS_RULES = ["<local>"].join(";")

export const setProxyConfig = (proxy?: string) => {
  if (proxy) {
    store.set("proxy", proxy)
  }
  const proxySetting = proxy ?? store.get("proxy")
  const proxyUri = normalizeProxyUri(proxySetting)
  if (!proxyUri) {
    session.defaultSession.setProxy({
      proxyRules: "direct://",
    })
    return
  }

  logger.log(`Loading proxy: ${proxyUri}`)
  session.defaultSession.setProxy({
    proxyRules: proxyUri,
    proxyBypassRules: BYPASS_RULES,
  })
}
