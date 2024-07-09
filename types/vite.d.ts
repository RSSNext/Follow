/// <reference types="vite/client" />

interface ImportMetaEnv {

  VITE_WEB_URL: string
  VITE_API_URL: string
  VITE_IMGPROXY_URL: string
  VITE_SENTRY_DSN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
