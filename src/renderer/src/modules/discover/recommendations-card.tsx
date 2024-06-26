import { SiteIcon } from "@renderer/components/site-icon"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@renderer/components/ui/card"
import { useModalStack } from "@renderer/components/ui/modal/stacked/hooks"
import type { FC } from "react"
import { memo } from "react"

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
          <SiteIcon url={`https://${data.url}`} />
          {data.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <CardDescription>
          <ul className="space-y-1">
            {Object.keys(data.routes).map((route) => (
              <li
                key={route}
                className="duration-200 hover:text-theme-foreground-hover"
                onClick={() => {
                  present({
                    content: () => (
                      <RecommendationContent routePrefix={routePrefix} route={data.routes[route]} />
                    ),
                    icon: (
                      <SiteIcon
                        className="size-4"
                        url={`https://${data.url}`}
                      />
                    ),
                    title: `${data.name} - ${data.routes[route].name}`,
                  })
                }}
              >
                {data.routes[route].name}
              </li>
            ))}
          </ul>
        </CardDescription>
      </CardContent>
    </Card>
  )
},
)
