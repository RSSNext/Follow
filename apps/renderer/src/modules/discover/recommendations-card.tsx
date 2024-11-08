import { Card, CardContent, CardHeader, CardTitle } from "@follow/components/ui/card/index.jsx"
import type { FC } from "react"
import { memo } from "react"

import { useModalStack } from "~/components/ui/modal/stacked/hooks"
import { FeedIcon } from "~/modules/feed/feed-icon"

import { RecommendationContent } from "./recommendation-content"
import styles from "./recommendations.module.css"
import type { RSSHubRouteDeclaration } from "./types"

interface RecommendationCardProps {
  data: RSSHubRouteDeclaration
  routePrefix: string
}
export const RecommendationCard: FC<RecommendationCardProps> = memo(({ data, routePrefix }) => {
  const { present } = useModalStack()
  return (
    <Card className={styles["recommendations-card"]}>
      <CardHeader className="relative p-5 pb-3">
        <div className="absolute left-0 top-0 h-[50px] w-full overflow-hidden">
          <span className="opacity-50 blur-2xl">
            <FeedIcon
              siteUrl={`https://${data.url}`}
              size={400}
              className="pointer-events-none size-[500px]"
            />
          </span>
        </div>

        <CardTitle className="relative z-[1] flex items-center pt-[10px] text-base">
          <span className="center box-content flex aspect-square rounded-full bg-background p-1.5">
            <span className="overflow-hidden rounded-full">
              <FeedIcon size={28} className="mr-0 " siteUrl={`https://${data.url}`} />
            </span>
          </span>
          <span className="ml-2 translate-y-1.5">{data.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <ul className="columns-2 gap-2 space-y-1 text-sm text-muted-foreground">
          {Object.keys(data.routes).map((route) => (
            <li
              key={route}
              className="group hover:text-theme-foreground-hover"
              onClick={(e) => {
                ;(e.target as HTMLElement).querySelector("button")?.click()
              }}
              tabIndex={-1}
            >
              <button
                type="button"
                className="-translate-x-1.5 rounded p-0.5 px-1.5 duration-200 group-hover:translate-x-0 group-hover:bg-muted"
                onClick={() => {
                  present({
                    id: `recommendation-content-${route}`,
                    content: () => (
                      <RecommendationContent routePrefix={routePrefix} route={data.routes[route]} />
                    ),
                    icon: <FeedIcon className="size-4" size={16} siteUrl={`https://${data.url}`} />,
                    title: `${data.name} - ${data.routes[route].name}`,
                  })
                }}
              >
                {data.routes[route].name}
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
})
