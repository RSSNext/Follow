import os from "node:os"

import { version as appVersion } from "@pkg"

export const mode = process.env.NODE_ENV
export const isDev = mode === "development"

export const isNightlyBuild = appVersion.includes("nightly")

export const channel: "development" | "beta" | "alpha" | "stable" | "nightly" = isDev
  ? "development"
  : isNightlyBuild
    ? "nightly"
    : "beta"

const { platform } = process
export const isMacOS = platform === "darwin"

export const isWindows = platform === "win32"

export const isLinux = platform === "linux"

/**
 * @see https://learn.microsoft.com/en-us/windows/release-health/windows11-release-information
 * Windows 11 buildNumber starts from 22000.
 */
const detectingWindows11 = () => {
  if (!isWindows) return false

  const release = os.release()
  const majorVersion = Number.parseInt(release.split(".")[0]!)
  const buildNumber = Number.parseInt(release.split(".")[2]!)

  return majorVersion === 10 && buildNumber >= 22000
}

export const isWindows11 = detectingWindows11()
