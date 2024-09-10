import type { FeedViewType } from "@renderer/lib/enum"

export type RSSHubRouteType = Record<string, RSSHubRouteDeclaration>
export interface RSSHubRouteDeclaration {
  routes: Routes
  name: string
  url: string
}
type Routes = Record<string, RSSHubRoute>
export type RSSHubParameterObject = {
  description: string
  default: string | null
  options?: {
    label: string
    value: string
  }[]
}

export type RSSHubParameter = string | RSSHubParameterObject
export type RSSHubRoute = {
  path: string
  categories: string[]
  example: string
  parameters: Record<string, RSSHubParameter>
  name: string
  maintainers: string[]
  location: string
  description: string
  view?: FeedViewType

  // features: Features
  // radar: RadarItem[]
}

// interface Features {
//   requireConfig: boolean
//   requirePuppeteer: boolean
//   antiCrawler: boolean
//   supportBT: boolean
//   supportPodcast: boolean
//   supportScihub: boolean
// }
// interface RadarItem {
//   source: string[]
//   target: string
// }

export interface FeedCardData {
  feed: {
    description: string | null
    title: string | null
    id: string
    image: string | null
    url: string
    siteUrl: string | null
    checkedAt: string
    lastModifiedHeader: string | null
    etagHeader: string | null
    ttl: number | null
    errorMessage: string | null
    errorAt: string | null
    ownerUserId: string | null
  }
  entries?:
    | {
      description: string | null
      title: string | null
      content: string | null
      id: string
      url: string | null
      feedId: string
      guid: string
      author: string | null
      authorUrl: string | null
      authorAvatar: string | null
      insertedAt: string
      publishedAt: string
      categories: string[] | null
      media?:
        | {
          type: "photo" | "video"
          url: string
          width?: number | undefined
          height?: number | undefined
          preview_image_url?: string | undefined
        }[]
        | null
        | undefined
      attachments?:
        | {
          url: string
          title?: string | undefined
          duration_in_seconds?: number | undefined
          mime_type?: string | undefined
          size_in_bytes?: number | undefined
        }[]
        | null
        | undefined
    }[]
    | undefined
  docs?: string | undefined
  isSubscribed?: boolean | undefined
  subscriptionCount?: number | undefined
}
