import { getDeviceToken } from "react-native-device-info"

export async function getDeviceTokenHeaders() {
  let deviceToken = ""
  try {
    deviceToken = await getDeviceToken()
  } catch (error) {
    console.error(error)
  }

  return deviceToken
    ? {
        "x-token": `d:${deviceToken}`,
      }
    : undefined
}
