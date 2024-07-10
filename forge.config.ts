import crypto from "node:crypto"
import fs from "node:fs"
import { readdir } from "node:fs/promises"
import path from "node:path"

import { FuseV1Options, FuseVersion } from "@electron/fuses"
import { MakerDMG } from "@electron-forge/maker-dmg"
import { MakerSquirrel } from "@electron-forge/maker-squirrel"
import { FusesPlugin } from "@electron-forge/plugin-fuses"
import type { ForgeConfig } from "@electron-forge/shared-types"
import MakerAppImage from "@pengx17/electron-forge-maker-appimage"
import { rimraf } from "rimraf"

const artifactRegex = /.*\.(?:exe|dmg|AppImage)$/
const platformNamesMap = {
  darwin: "macos",
  linux: "linux",
  win32: "windows",
}
const ymlMapsMap = {
  darwin: "latest-mac.yml",
  linux: "latest-linux.yml",
  win32: "latest.yml",
}

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
    new MakerAppImage({
      options: {
        icon: "resources/icon.png",
      },
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
  hooks: {
    postMake: async (config, makeResults) => {
      const yml: {
        version?: string
        files: {
          url: string
          sha512: string
          size: number
        }[]
        releaseDate?: string
      } = {
        version: makeResults[0].packageJSON.version,
        files: [],
      }
      makeResults = makeResults.map((result) => {
        result.artifacts = result.artifacts.map((artifact) => {
          if (artifactRegex.test(artifact)) {
            const newArtifact = `${path.dirname(artifact)}/${result.packageJSON.name}-${result.packageJSON.version}-${platformNamesMap[result.platform]}-${result.arch}${path.extname(artifact)}`
            fs.renameSync(artifact, newArtifact)

            try {
              const fileData = fs.readFileSync(newArtifact)
              const hash = crypto
                .createHash("sha512")
                .update(fileData)
                .digest("base64")
              const { size } = fs.statSync(newArtifact)

              yml.files.push({
                url: path.basename(newArtifact),
                sha512: hash,
                size,
              })
            } catch {
              console.error(`Failed to hash ${newArtifact}`)
            }
            return newArtifact
          } else {
            return artifact
          }
        })
        return result
      })
      yml.releaseDate = new Date().toISOString()
      const ymlStr =
        `version: ${yml.version}\n` +
        `files:\n${
        yml.files
          .map((file) => (
              `  - url: ${file.url}\n` +
              `    sha512: ${file.sha512}\n` +
              `    size: ${file.size}\n`
            ))
          .join("")
        }releaseDate: ${yml.releaseDate}\n`

      const ymlPath = `${path.dirname(makeResults[0].artifacts[0])}/${ymlMapsMap[makeResults[0].platform]}`
      fs.writeFileSync(ymlPath, ymlStr)

      makeResults.push({
        artifacts: [ymlPath],
        platform: makeResults[0].platform,
        arch: makeResults[0].arch,
        packageJSON: makeResults[0].packageJSON,
      })

      return makeResults
    },
  },
}

export default config
