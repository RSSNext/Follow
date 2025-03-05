import { env } from "@follow/shared/env"
import { UrlBuilder as UrlBuilderClass } from "@follow/utils/url-builder"

export const UrlBuilder = new UrlBuilderClass(env.VITE_WEB_URL)
