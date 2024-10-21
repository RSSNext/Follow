import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

const isDev = "process" in globalThis ? process.env.NODE_ENV === "development" : import.meta.env.DEV
export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_WEB_URL: z.string().url(),
    VITE_API_URL: z.string().url(),
    VITE_IMGPROXY_URL: z.string().url(),
    VITE_SENTRY_DSN: z.string().optional(),
    VITE_INBOXES_EMAIL: z.string().default("@follow.re"),
    VITE_FIREBASE_CONFIG: z.string().optional(),

    VITE_OPENPANEL_CLIENT_ID: z.string().optional(),
    VITE_OPENPANEL_API_URL: z.string().url().optional(),

    // For external, use api_url if you don't want to fill it in.
    VITE_EXTERNAL_PROD_API_URL: z.string().optional(),
    VITE_EXTERNAL_DEV_API_URL: z.string().optional(),
    VITE_EXTERNAL_API_URL: z.string().optional(),
  },

  emptyStringAsUndefined: true,
  runtimeEnv: getRuntimeEnv() as any,

  skipValidation: !isDev,
})

function metaEnvIsEmpty() {
  try {
    return Object.keys(import.meta.env || {}).length === 0
  } catch {
    return true
  }
}

function getRuntimeEnv() {
  try {
    if (metaEnvIsEmpty()) {
      return process.env
    }
    return injectExternalEnv(import.meta.env)
  } catch {
    return process.env
  }
}

function injectExternalEnv<T>(originEnv: T): T {
  if (!("document" in globalThis)) {
    return originEnv
  }
  const prefix = "__followEnv"
  const env = globalThis[prefix]
  if (!env) {
    return originEnv
  }

  for (const key in env) {
    originEnv[key] = env[key]
  }
  return originEnv
}
