import "@expo/metro-runtime"

import { registerRootComponent } from "expo"
import { App } from "expo-router/build/qualified-entry"
import { RootSiblingParent } from "react-native-root-siblings"

// import { renderRootComponent } from "expo"
import { initializeApp } from "./initialize"

initializeApp().then(() => {
  // This file should only import and register the root. No components or exports
  // should be added here.
  // renderRootComponent(App)
})

const MApp = () => {
  return (
    <RootSiblingParent>
      <App />
    </RootSiblingParent>
  )
}

registerRootComponent(MApp)
