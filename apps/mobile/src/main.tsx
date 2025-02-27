import "@expo/metro-runtime"

import { registerRootComponent } from "expo"
import { Image } from "expo-image"
import { App } from "expo-router/build/qualified-entry"
import { cssInterop } from "nativewind"
import { enableFreeze } from "react-native-screens"

import { initializeApp } from "./initialize"

enableFreeze(true)
cssInterop(Image, { className: "style" })

initializeApp()

registerRootComponent(App)
