import type { FeedViewType } from "@follow/constants"

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
