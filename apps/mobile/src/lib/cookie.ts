import CookieManager from "@react-native-cookies/cookies"

import { kv } from "./kv"

const keys = {
  sessionToken: "better-auth.session_token",
}
export const setSessionToken = (token: string) => {
  kv.setSync(keys.sessionToken, token)

  return CookieManager.set(process.env.EXPO_PUBLIC_API_URL, {
    name: keys.sessionToken,
    value: token,
    httpOnly: true,
    secure: true,
  })
}

export const getSessionToken = async () => {
  const cookies = await CookieManager.get(process.env.EXPO_PUBLIC_API_URL)

  return cookies[keys.sessionToken] || kv.getSync(keys.sessionToken)
}

export const clearSessionToken = async () => {
  await kv.delete(keys.sessionToken)
  return CookieManager.clearAll()
}
