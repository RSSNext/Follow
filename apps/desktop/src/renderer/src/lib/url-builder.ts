import { WEB_URL } from "~/constants/env"
import { UrlBuilder as UrlBuilderClass } from "~/lib/url-builder"

export const UrlBuilder = new UrlBuilderClass(WEB_URL)
