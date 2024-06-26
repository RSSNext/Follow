import { LoadingCircle } from "@renderer/components/ui/loading"
import { useBizQuery } from "@renderer/hooks"
import { Queries } from "@renderer/queries"

import { RecommendationCard } from "./recommendations-card"

export function Recommendations() {
  const rsshubPopular = useBizQuery(
    Queries.discover.rsshubCategory({
      category: "popular",
    }),
  )

  if (rsshubPopular.isLoading) {
    return <LoadingCircle className="mt-16" size="medium" />
  }

  const { data } = rsshubPopular

  if (!data) {
    return null
  }

  return (
    <div className="mt-8">
      <div className="text-center text-lg font-bold">Popular</div>

      <div className="mt-4 grid grid-cols-3 gap-4 px-3">
        {Object.keys(data).map((key) => (
          <RecommendationCard key={key} data={data[key]} routePrefix={key} />
        ))}
      </div>
    </div>
  )
}
