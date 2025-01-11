/*
 * If you add an asset you need to run `npx expo prebuild`
 * If you rename or delete an asset you need to run `npx expo prebuild --clean` to delete them in your android and ios folder as well.
 *
 * This plugin is inspired by the following plugins:
 * - [expo-custom-assets](https://github.com/Malaa-tech/expo-custom-assets)
 * - [spacedrive](https://github.com/spacedriveapp/spacedrive/blob/main/apps/mobile/scripts/withRiveAssets.js)
 */

const { withDangerousMod, withXcodeProject, IOSConfig } = require("@expo/config-plugins")
const fs = require("node:fs")
const path = require("node:path")
const { execSync } = require("node:child_process")
const process = require("node:process")

const followRoot = path.resolve(__dirname, "..", "..", "..")

// Specify the source directory of your assets
const ASSET_SOURCE_DIR = path.join("out", "rn-web")

const IOS_GROUP_NAME = "Assets"

const isAssetReady = () => {
  return fs.existsSync(path.resolve(followRoot, ASSET_SOURCE_DIR))
}

const withFollowAssets = (config) => {
  if (!isAssetReady()) {
    console.info(
      "Assets source directory not found! Running `pnpm build:rn-web` to generate assets.",
    )
    process.chdir(followRoot)
    execSync("pnpm build:rn-web")
    process.chdir(__dirname)
  }
  if (!isAssetReady()) {
    throw new Error("Assets source directory not found! Please make sure the build is successful.")
  }
  config = addAndroidResources(config)
  config = addIOSResources(config)
  return config
}

// Code inspired by https://github.com/rive-app/rive-react-native/issues/185#issuecomment-1593396573
function addAndroidResources(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      // Get the path to the Android project directory
      const { projectRoot } = config.modRequest

      // Get the path to the Android resources directory
      const resDir = path.join(projectRoot, "android", "app", "src", "main", "res")

      // Create the 'raw' directory if it doesn't exist
      const rawDir = path.join(resDir, "raw")
      fs.mkdirSync(rawDir, { recursive: true })

      // Get the path to the assets directory
      const assetSourcePath = path.join(followRoot, ASSET_SOURCE_DIR)

      // Retrieve all files in the assets directory
      // const assetFiles = fs.readdirSync(assetSourcePath)

      // Move asset file to the resources 'raw' directory
      fs.cpSync(assetSourcePath, rawDir, { recursive: true })

      // Move each asset file to the resources 'raw' directory
      // for (const assetFile of assetFiles) {
      //   const srcAssetPath = path.join(assetSourcePath, assetFile)
      //   const destAssetPath = path.join(rawDir, assetFile)
      //   fs.copyFileSync(srcAssetPath, destAssetPath)
      // }

      return config
    },
  ])
}

// Code inspired by https://github.com/expo/expo/blob/61f8cf8d4b3cf5f8bf61f346476ebdb4aff40545/packages/expo-font/plugin/src/withFontsIos.ts
function addIOSResources(config) {
  return withXcodeProject(config, async (config) => {
    const project = config.modResults
    const { platformProjectRoot } = config.modRequest

    // Create Assets group in project
    IOSConfig.XcodeUtils.ensureGroupRecursively(project, IOS_GROUP_NAME)

    // Get filepaths
    const assetSourcePath = path.resolve(followRoot, ASSET_SOURCE_DIR)

    // Add assets to group
    addIOSResourceFile(project, platformProjectRoot, [assetSourcePath])

    return config
  })

  function addIOSResourceFile(project, platformRoot, assetFilesPaths) {
    for (const assetFile of assetFilesPaths) {
      const riveFilePath = path.relative(platformRoot, assetFile)
      IOSConfig.XcodeUtils.addResourceFileToGroup({
        filepath: riveFilePath,
        groupName: IOS_GROUP_NAME,
        project,
        isBuildFile: true,
        verbose: true,
      })
    }
  }
}

module.exports = withFollowAssets
