import crypto from "node:crypto"
import fs, { readdirSync } from "node:fs"
import { readdir } from "node:fs/promises"
import path, { resolve } from "node:path"

import { FuseV1Options, FuseVersion } from "@electron/fuses"
import { MakerDMG } from "@electron-forge/maker-dmg"
import { MakerSquirrel } from "@electron-forge/maker-squirrel"
import { MakerZIP } from "@electron-forge/maker-zip"
import { FusesPlugin } from "@electron-forge/plugin-fuses"
import type { ForgeConfig } from "@electron-forge/shared-types"
import MakerAppImage from "@pengx17/electron-forge-maker-appimage"
import setLanguages from "electron-packager-languages"
import { dump } from "js-yaml"
import { rimraf, rimrafSync } from "rimraf"

const ymlMapsMap = {
  darwin: "latest-mac.yml",
  linux: "latest-linux.yml",
  win32: "latest.yml",
}

const keepModules = new Set(["font-list", "vscode-languagedetection"])
const keepLanguages = new Set(["en", "en_GB", "zh_CN"])
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

  if (platform === "darwin") {
    const frameworkResourcePath = resolve(
      buildPath,
      "../../Frameworks/Electron Framework.framework/Versions/A/Resources",
    )

    for (const file of readdirSync(frameworkResourcePath)) {
      if (file.endsWith(".lproj") && !keepLanguages.has(file.split(".")[0])) {
        rimrafSync(resolve(frameworkResourcePath, file))
      }
    }
  }

  // Keep only node_modules to be included in the app

  await Promise.all([
    ...(await readdir(buildPath).then((items) =>
      items
        .filter((item) => !appItems.has(item))
        .map((item) => rimraf(path.join(buildPath, item))),
    )),
    ...(await readdir(path.join(buildPath, "node_modules")).then((items) =>
      items
        .filter((item) => !keepModules.has(item))
        .map((item) => rimraf(path.join(buildPath, "node_modules", item))),
    )),
  ])

  callback()
}

const ignorePattern = new RegExp(
  `^/node_modules/(?!${[...keepModules].join("|")})`,
)

const config: ForgeConfig = {
  packagerConfig: {
    appBundleId: "is.follow",
    icon: "resources/icon",
    extraResource: ["./resources/app-update.yml"],
    protocols: [
      {
        name: "Follow",
        schemes: ["follow"],
      },
    ],

    afterCopy: [cleanSources, setLanguages([...keepLanguages])],
    asar: true,
    ignore: [ignorePattern],

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
    new MakerZIP({}, ["darwin"]),
    new MakerDMG((arch) => ({
      overwrite: true,
      name: `Follow${arch === "universal" ? "" : `-${arch}`}`,
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
    })),
    new MakerSquirrel((arch) => ({
      name: `Follow-${arch}`,
      setupIcon: "resources/icon.ico",
    })),
    new MakerAppImage((arch) => ({
      options: {
        name: `Follow-${arch}`,
        icon: "resources/icon.png",
        mimeType: ["x-scheme-handler/follow"],
      },
    })),
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
  hooks: {
    postMake: async (config, makeResults) => {
      const updaterObject = {
        version: makeResults[0].packageJSON.version,
        files: [] as {
          url: string
          sha512: string
          size: number
        }[],
        releaseDate: new Date().toISOString(),
      }

      for (const result of makeResults) {
        const fileData = fs.readFileSync(result.artifacts[0])
        const hash = crypto
          .createHash("sha512")
          .update(fileData)
          .digest("base64")
        const { size } = fs.statSync(result.artifacts[0])

        updaterObject.files.push({
          url: path.basename(result.artifacts[0]),
          sha512: hash,
          size,
        })
      }

      fs.writeFileSync(
        resolve(__dirname, "./out/make", ymlMapsMap[makeResults[0].platform]),
        dump(updaterObject),
      )

      return makeResults
    },
  },
}

export default config
