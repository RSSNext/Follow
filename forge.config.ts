import { FuseV1Options, FuseVersion } from "@electron/fuses"
import { MakerDeb } from "@electron-forge/maker-deb"
import { MakerDMG } from "@electron-forge/maker-dmg"
import { MakerRpm } from "@electron-forge/maker-rpm"
import { MakerSquirrel } from "@electron-forge/maker-squirrel"
import { FusesPlugin } from "@electron-forge/plugin-fuses"
import type { ForgeConfig } from "@electron-forge/shared-types"

const config: ForgeConfig = {
  packagerConfig: {
    appBundleId: "is.follow",
    icon: "resources/icon",
    ignore: [
      /^\/src/,
      /(.eslintrc.json)|(.gitignore)|(electron.vite.config.ts)|(forge.config.ts)|(tsconfig.*)/,
    ],
    asar: true,
    osxSign: {
      optionsForFile: () => ({
        entitlements: "build/entitlements.mac.plist",
      }),
      keychain: "app-signing.keychain",
    },
    // osxNotarize: {
    //   appleId: process.env.APPLE_ID!,
    //   appleIdPassword: process.env.APPLE_PASSWORD!,
    //   teamId: process.env.APPLE_TEAM_ID!,
    // },
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
    new MakerDMG({}),
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
}

export default config
