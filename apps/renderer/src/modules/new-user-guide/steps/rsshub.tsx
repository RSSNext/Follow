import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { Markdown } from "~/components/ui/markdown/Markdown"
import { useAuthQuery } from "~/hooks/common"
import { isASCII } from "~/lib/utils"
import { RecommendationCard } from "~/modules/discover/recommendations-card"
import { Queries } from "~/queries"

const pickedRoutes = new Set([
  "weibo",
  "bilibili",
  "twitter",
  "telegram",
  "youtube",
  "github",
  "pixiv",
  "jike",
  "xiaoyuzhou",
])

export function RSSHubGuide() {
  const { t } = useTranslation("app")

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

  if (rsshubPopular.isLoading) {
    return null
  }

  if (!data) {
    return null
  }

  return (
    <div className="h-[610px] w-[630px] space-y-3">
      <Markdown className="text-balance text-sm">{t("new_user_guide.step.rsshub.info")}</Markdown>
      <div className="grid grid-cols-3 gap-3">
        {keys
          .filter((key) => pickedRoutes.has(key))
          .map((key) => (
            <RecommendationCard key={key} data={data[key]} routePrefix={key} />
          ))}
      </div>
    </div>
  )
}
