export const APP_PROTOCOL = import.meta.env.DEV ? "follow-dev" : "follow"
export const DEEPLINK_SCHEME = `${APP_PROTOCOL}://`

export const WEB_URL = process.env.VERCEL_URL ?? import.meta.env.VERCEL_URL ?? import.meta.env.VITE_WEB_URL
