import { version as appVersion } from "@pkg"

const isNightlyBuild = appVersion.includes("nightly")

export const appUpdaterConfig = {
  // Disable renderer hot update will trigger app update when available
  enableRenderHotUpdate: isNightlyBuild,
  // Disable app update will also disable renderer hot update
  enableAppUpdate: true,
  // enableAppUpdate: !isDev,

  app: {
    autoCheckUpdate: true,
    autoDownloadUpdate: true,
    checkUpdateInterval: 15 * 60 * 1000,
  },
}
