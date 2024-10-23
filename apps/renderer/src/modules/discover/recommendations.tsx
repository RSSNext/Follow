import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { useAuthQuery } from "~/hooks/common"
import { cn, isASCII } from "~/lib/utils"
import { Queries } from "~/queries"

import { RecommendationCard } from "./recommendations-card"

export function Recommendations({
  hideTitle,
  className,
}: {
  hideTitle?: boolean
  className?: string
}) {
  const rsshubPopular = useAuthQuery(
    Queries.discover.rsshubCategory({
      category: "popular",
    }),
    {
      meta: {
        persist: true,
      },
    },
  )

  const { data } = rsshubPopular

  const keys = useMemo(() => {
    if (data) {
      return Object.keys(data).sort((a, b) => {
        const aname = data[a].name
        const bname = data[b].name

        const aRouteName = data[a].routes[Object.keys(data[a].routes)[0]].name
        const bRouteName = data[b].routes[Object.keys(data[b].routes)[0]].name

        const ia = isASCII(aname) && isASCII(aRouteName)
        const ib = isASCII(bname) && isASCII(bRouteName)

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

  const { t } = useTranslation()
  if (rsshubPopular.isLoading) {
    return null
  }

  if (!data) {
    return null
  }

  return (
    <div className={cn(!hideTitle && "mt-8")}>
      {!hideTitle && <div className="text-center text-lg font-bold">{t("discover.popular")}</div>}

      <div className={cn("mt-4 grid grid-cols-3 gap-4 px-3", className)}>
        {keys.map((key) => (
          <RecommendationCard key={key} data={data[key]} routePrefix={key} />
        ))}
      </div>
    </div>
  )
}
