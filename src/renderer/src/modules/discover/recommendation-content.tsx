import { DiscoverFeedForm } from "./DiscoverFeedForm"
import type { RSSHubRoute } from "./types"

export const RecommendationContent = ({
  route,
  routePrefix,
}: {
  route: RSSHubRoute
  routePrefix: string
}) => (
  <div className="w-full min-w-[550px] max-w-[700px]">
    <DiscoverFeedForm route={route} routePrefix={routePrefix} />
  </div>
)
