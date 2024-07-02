export const APP_PROTOCOL = import.meta.env.DEV ? "follow-DEV" : "follow"
export const DEEPLINK_SCHEME = `${APP_PROTOCOL}://`

// export const WEB_URL = import.meta.env.VITE_VERCEL_URL ?? import.meta.env.VITE_WEB_URL
export const WEB_URL = import.meta.env.VITE_WEB_URL
