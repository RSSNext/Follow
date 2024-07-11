import { z } from "zod"

export const ReleaseTypeSchema = z.enum([
  "stable",
  "beta",
  "internal",
])

export const envBuildType = (process.env.VITE_BUILD_TYPE || "internal")
  .trim()
  .toLowerCase()

export const buildType = ReleaseTypeSchema.parse(envBuildType)

export const mode = process.env.NODE_ENV
export const isDev = mode === "development"
