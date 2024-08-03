import { app } from "electron"
import * as semver from "semver"

export const mode = process.env.NODE_ENV
export const isDev = mode === "development"

export const channel = isDev ?
  "development" :
    (semver.prerelease(app.getVersion())?.[0] as string) || "stable"

const { platform } = process
export const isMacOS = platform === "darwin"

export const isWindows = platform === "win32"

export const isLinux = platform === "linux"
