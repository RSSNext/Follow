/// <reference types="vite/client" />

interface ImportMetaEnv {

  VITE_WEB_URL: string
  VITE_API_URL: string
  VITE_IMGPROXY_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
