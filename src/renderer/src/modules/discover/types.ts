export type RSSHubRouteType = Record<string, RSSHubRouteDeclaration>
export interface RSSHubRouteDeclaration {
  routes: Routes
  name: string
  url: string
}
type Routes = Record<string, RSSHubRoute>
export type RSSHubRoute = {
  path: string
  categories: string[]
  example: string
  parameters: Record<string, string>
  name: string
  maintainers: string[]
  location: string
  description: string

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
