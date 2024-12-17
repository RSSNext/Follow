const { getDefaultConfig } = require("expo/metro-config")
const { withNativeWind } = require("nativewind/metro")

const config = getDefaultConfig(__dirname, { isCSSEnabled: true })

config.resolver.unstable_enablePackageExports = true

module.exports = withNativeWind(config, { input: "./src/global.css" })
