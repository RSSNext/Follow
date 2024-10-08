import type { FC } from "react"
import { memo } from "react"

import { FeedIcon } from "~/components/feed-icon"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { useModalStack } from "~/components/ui/modal/stacked/hooks"

import { RecommendationContent } from "./recommendation-content"
import type { RSSHubRouteDeclaration } from "./types"

interface RecommendationCardProps {
  data: RSSHubRouteDeclaration
  routePrefix: string
}
export const RecommendationCard: FC<RecommendationCardProps> = memo(({ data, routePrefix }) => {
  const { present } = useModalStack()
  return (
    <Card className="shadow-none">
      <CardHeader className="p-5 pb-3">
        <CardTitle className="flex items-center text-base">
          <FeedIcon siteUrl={`https://${data.url}`} />
          {data.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <ul className="space-y-1 text-sm text-muted-foreground">
          {Object.keys(data.routes).map((route) => (
            <li
              key={route}
              className="hover:text-theme-foreground-hover"
              onClick={(e) => {
                ;(e.target as HTMLElement).querySelector("button")?.click()
              }}
              tabIndex={-1}
            >
              <button
                type="button"
                className="rounded p-0.5 duration-200 hover:bg-muted hover:px-1.5"
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
