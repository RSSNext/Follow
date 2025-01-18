import { Platform } from "react-native"

export const isIOS = Platform.OS === "ios"
export const isAndroid = Platform.OS === "android"
export const isNative = isIOS || isAndroid
export const devicePlatform = isIOS ? "ios" : isAndroid ? "android" : "web"
export const isWeb = !isNative
