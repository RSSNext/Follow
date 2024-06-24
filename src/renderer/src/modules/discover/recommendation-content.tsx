import type { RecommendationItem } from "@renderer/models"

export const RecommendationContent = ({
  route,
}: {
  route: RecommendationItem["routes"][string]
}) => (
  <>
    rsshub:/
    {route.path}
  </>
)
