import CookieManager from "@react-native-cookies/cookies"

const keys = {
  sessionToken: "better-auth.session_token",
}
export const setSessionToken = (token: string) => {
  return CookieManager.set(process.env.EXPO_PUBLIC_API_URL, {
    name: keys.sessionToken,
    value: token,
    httpOnly: true,
  })
}

export const getSessionToken = async () => {
  const cookies = await CookieManager.get(process.env.EXPO_PUBLIC_API_URL)
  return cookies[keys.sessionToken]
}
