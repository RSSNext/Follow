import { getApp } from "@react-native-firebase/app"
import getAppCheck, { getToken } from "@react-native-firebase/app-check"

export async function getTokenHeaders() {
  const app = getApp()
  const appCheck = getAppCheck(app)
  let token = ""
  try {
    const appCheckToken = await getToken(appCheck, false)
    token = appCheckToken.token
  } catch (error) {
    console.error("error", error)
  }

  return token
    ? {
        "x-token": `ac:${token}`,
      }
    : undefined
}
