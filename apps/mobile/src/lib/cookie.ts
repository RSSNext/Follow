import CookieManager from "@react-native-cookies/cookies"

import { cookieKey, getSessionTokenFromCookie, sessionTokenKey } from "./auth"
import { getApiUrl } from "./env"
import { kv } from "./kv"

export const setSessionToken = (token: string) => {
  kv.setSync(
    cookieKey,
    JSON.stringify({
      [sessionTokenKey]: {
        value: token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(),
      },
    }),
  )

  return CookieManager.set(getApiUrl(), {
    name: sessionTokenKey,
    value: token,
    httpOnly: true,
    secure: true,
  })
}

export const getSessionToken = async () => {
  const cookies = await CookieManager.get(getApiUrl())

  return cookies[sessionTokenKey] || getSessionTokenFromCookie()
}

export const clearSessionToken = async () => {
  await kv.delete(cookieKey)
  return CookieManager.clearAll()
}
