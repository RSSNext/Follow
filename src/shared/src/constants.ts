import { env } from "@env"

export const APP_PROTOCOL = import.meta.env.DEV ? "follow-dev" : "follow"
export const DEEPLINK_SCHEME = `${APP_PROTOCOL}://`

// export const WEB_URL = import.meta.env.VITE_VERCEL_URL ?? import.meta.env.VITE_WEB_URL
export const WEB_URL = env.VITE_WEB_URL
