/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_WEB_URL: string
  VITE_API_URL: string
  VITE_IMGPROXY_URL: string
  VITE_SENTRY_DSN: string
  VITE_POSTHOG_KEY: string
  VITE_FIREBASE_CONFIG: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
