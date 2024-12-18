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
    [
      "expo-font",
      {
        fonts: [
          "./assets/font/sn-pro/SNPro-Black.otf",
          "./assets/font/sn-pro/SNPro-BlackItalic.otf",
          "./assets/font/sn-pro/SNPro-Bold.otf",
          "./assets/font/sn-pro/SNPro-BoldItalic.otf",
          "./assets/font/sn-pro/SNPro-Heavy.otf",
          "./assets/font/sn-pro/SNPro-HeavyItalic.otf",
          "./assets/font/sn-pro/SNPro-Light.otf",
          "./assets/font/sn-pro/SNPro-LightItalic.otf",
          "./assets/font/sn-pro/SNPro-Medium.otf",
          "./assets/font/sn-pro/SNPro-MediumItalic.otf",
          "./assets/font/sn-pro/SNPro-Regular.otf",
          "./assets/font/sn-pro/SNPro-RegularItalic.otf",
          "./assets/font/sn-pro/SNPro-Semibold.otf",
          "./assets/font/sn-pro/SNPro-SemiboldItalic.otf",
          "./assets/font/sn-pro/SNPro-Thin.otf",
          "./assets/font/sn-pro/SNPro-ThinItalic.otf",
        ],
      },
    ],
    [require("./scripts/with-follow-assets.js")],
  ],
  experiments: {
    typedRoutes: true,
  },
})
