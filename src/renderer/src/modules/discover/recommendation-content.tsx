import type { RSSHubRoute } from "./types"

export const RecommendationContent = ({
  route,
}: {
  route: RSSHubRoute
}) => {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const keys = []
  return (
    <>
      rsshub:/
      {route.path}
    </>
  )
}
