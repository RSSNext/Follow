import { LoadingCircle } from "@renderer/components/ui/loading"
import { useBizQuery } from "@renderer/hooks"
import { isASCII } from "@renderer/lib/utils"
import { Queries } from "@renderer/queries"
import { useMemo } from "react"

import { RecommendationCard } from "./recommendations-card"

export function Recommendations() {
  const rsshubPopular = useBizQuery(
    Queries.discover.rsshubCategory({
      category: "popular",
    }),
  )

  const { data } = rsshubPopular

  const keys = useMemo(() => {
    if (data) {
      return Object.keys(data).sort((a, b) => {
        const aname = data[a].name[0]
        const bname = data[b].name[0]
        const ia = isASCII(aname)
        const ib = isASCII(bname)
        if (ia && ib) {
          return aname.toLowerCase() < bname.toLowerCase() ? -1 : 1
        } else if (ia || ib) {
          return ia > ib ? -1 : 1
        } else {
          return 0
        }
      })
    } else {
      return []
    }
  }, [data])

  if (rsshubPopular.isLoading) {
    return <LoadingCircle className="mt-16" size="medium" />
  }

  if (!data) {
    return null
  }

  return (
    <div className="mt-8">
      <div className="text-center text-lg font-bold">Popular</div>

      <div className="mt-4 grid grid-cols-3 gap-4 px-3">
        {keys.map((key) => (
          <RecommendationCard key={key} data={data[key]} routePrefix={key} />
        ))}
      </div>
    </div>
  )
}
