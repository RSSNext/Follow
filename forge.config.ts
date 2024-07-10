import { readdir } from "node:fs/promises"
import path from "node:path"

import { FuseV1Options, FuseVersion } from "@electron/fuses"
import { MakerDeb } from "@electron-forge/maker-deb"
import { MakerDMG } from "@electron-forge/maker-dmg"
import { MakerRpm } from "@electron-forge/maker-rpm"
import { MakerSquirrel } from "@electron-forge/maker-squirrel"
import { FusesPlugin } from "@electron-forge/plugin-fuses"
import type { ForgeConfig } from "@electron-forge/shared-types"
import { rimraf } from "rimraf"

// remove folders & files not to be included in the app
async function cleanSources(
  buildPath,
  electronVersion,
  platform,
  arch,
  callback,
) {
  // folders & files to be included in the app
  const appItems = new Set([
    "dist",
    "node_modules",
    "package.json",
    "resources",
  ])

  // Keep only node_modules to be included in the app
  const modules = new Set(["font-list"])
  await Promise.all([
    ...(await readdir(buildPath).then((items) =>
      items
        .filter((item) => !appItems.has(item))
        .map((item) => rimraf(path.join(buildPath, item))),
    )),
    ...(await readdir(path.join(buildPath, "node_modules")).then((items) =>
      items
        .filter((item) => !modules.has(item))
        .map((item) => rimraf(path.join(buildPath, "node_modules", item))),
    )),
  ])

  callback()
}
const config: ForgeConfig = {
  packagerConfig: {
    appBundleId: "is.follow",
    icon: "resources/icon",

    afterCopy: [cleanSources],
    asar: true,
    ignore: [/^\/node_modules\/(?!font-list)/],
    prune: true,
    ...(process.env.APPLE_ID &&
      process.env.APPLE_PASSWORD &&
      process.env.APPLE_TEAM_ID && {
      osxSign: {
        optionsForFile: () => ({
          entitlements: "build/entitlements.mac.plist",
        }),
        keychain: process.env.KEYCHAIN_PATH,
      },
      osxNotarize: {
        appleId: process.env.APPLE_ID!,
        appleIdPassword: process.env.APPLE_PASSWORD!,
        teamId: process.env.APPLE_TEAM_ID!,
      },
    }),
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({}),
    new MakerRpm({}),
    new MakerDeb({
      options: {
        icon: "resources/icon.png",
      },
    }),
    new MakerDMG({
      background: "resources/dmg-background.png",
      icon: "resources/dmg-icon.icns",
      iconSize: 160,
      additionalDMGOptions: {
        window: {
          size: {
            width: 660,
            height: 400,
          },
        },
      },
      contents: (opts) => [
        {
          x: 180,
          y: 170,
          type: "file",
          path: (opts as any).appPath,
        },
        {
          x: 480,
          y: 170,
          type: "link",
          path: "/Applications",
        },
      ],
    }),
  ],
  plugins: [
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "RSSNext",
          name: "follow",
        },
        draft: true,
      },
    },
  ],
}

export default config
