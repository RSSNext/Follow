import { resolve } from "node:path"

import type { ConfigContext, ExpoConfig } from "expo/config"

const roundedIconPath = resolve(__dirname, "../../resources/icon.png")
const iconPath = resolve(__dirname, "./assets/icon.png")
const adaptiveIconPath = resolve(__dirname, "./assets/adaptive-icon.png")
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Follow",
  slug: "follow",
  version: "1.0.0",
  orientation: "portrait",
  icon: iconPath,
  scheme: "follow",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: "is.follow.app",
  },
  android: {
    package: "is.follow.app",
    adaptiveIcon: {
      foregroundImage: adaptiveIconPath,
      backgroundColor: "#FF5C00",
    },
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: iconPath,
  },
  plugins: [
    [
      "expo-router",
      {
        root: "./src/screens",
      },
    ],
    [
      "expo-splash-screen",
      {
        image: roundedIconPath,
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    "react-native-bottom-tabs",
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static",
        },
      },
    ],
    [require("./scripts/with-follow-assets.js")],
  ],
  experiments: {
    typedRoutes: true,
  },
})
