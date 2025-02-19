import { resolve } from "node:path"

import type { ConfigContext, ExpoConfig } from "expo/config"

import PKG from "./package.json"

// const isDev = process.env.NODE_ENV === "development"
const isCI = process.env.CI === "true"
// const roundedIconPath = resolve(__dirname, "../../resources/icon.png")
const iconPath = resolve(__dirname, "./assets/icon.png")
const adaptiveIconPath = resolve(__dirname, "./assets/adaptive-icon.png")
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,

  extra: {
    eas: {
      projectId: "a6335b14-fb84-45aa-ba80-6f6ab8926920",
    },
  },
  owner: "follow",
  updates: {
    url: "https://u.expo.dev/a6335b14-fb84-45aa-ba80-6f6ab8926920",
  },
  runtimeVersion: {
    policy: "appVersion",
  },

  name: "Follow",
  slug: "follow",
  version: PKG.version,
  orientation: "portrait",
  icon: iconPath,
  scheme: "follow",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: "is.follow",
    usesAppleSignIn: true,
    infoPlist: {
      LSApplicationCategoryType: "public.app-category.news",
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: "is.follow",
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
      "expo-document-picker",
      {
        iCloudContainerEnvironment: "Production",
      },
    ],
    "expo-localization",
    [
      "expo-router",
      {
        root: "./src/screens",
      },
    ],
    [
      "expo-splash-screen",
      {
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],
    "expo-build-properties",
    "expo-sqlite",
    [
      "expo-media-library",
      {
        photosPermission: "Allow $(PRODUCT_NAME) to access your photos.",
        savePhotosPermission: "Allow $(PRODUCT_NAME) to save photos.",
        isAccessMediaLocationEnabled: true,
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
    "expo-apple-authentication",
    "expo-av",
    [
      require("./scripts/with-follow-assets.js"),
      {
        // Add asset directory paths, the plugin copies the files in the given paths to the app bundle folder named Assets
        assetsPath: !isCI ? resolve(__dirname, "..", "..", "out", "rn-web") : "/tmp/rn-web",
      },
    ],
    [require("./scripts/with-follow-app-delegate.js")],
    "expo-secure-store",
  ],
  experiments: {
    typedRoutes: true,
  },
})
