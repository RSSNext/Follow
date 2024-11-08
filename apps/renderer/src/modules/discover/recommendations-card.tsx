import { Card, CardContent, CardHeader, CardTitle } from "@follow/components/ui/card/index.jsx"
import type { FC } from "react"
import { memo, useMemo } from "react"

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

  const { maintainers, categories } = useMemo(() => {
    const maintainers = new Set<string>()
    const categories = new Set<string>()
    for (const route in data.routes) {
      const routeData = data.routes[route]
      if (routeData.maintainers) {
        routeData.maintainers.forEach((m) => maintainers.add(m))
      }
      if (routeData.categories) {
        routeData.categories.forEach((c) => categories.add(c))
      }
    }
    return {
      maintainers: Array.from(maintainers),
      categories: Array.from(categories),
    }
  }, [data])

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
              <FeedIcon size={28} className="mr-0" siteUrl={`https://${data.url}`} />
            </span>
          </span>
          <span className="ml-2 translate-y-1.5">{data.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex grow flex-col p-5 pt-0">
        <ul className="grow columns-2 gap-2 space-y-1 text-sm text-foreground/90">
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
                className="rounded p-0.5 px-1.5 duration-200 group-hover:bg-muted"
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

        <div className="mt-4 flex flex-col gap-2 text-muted-foreground">
          <div className="flex flex-1 items-center text-sm">
            <i className="i-mingcute-hammer-line mr-1 shrink-0 translate-y-0.5 self-start" />

            <span className="flex flex-wrap gap-1">
              {maintainers.map((m) => (
                <a
                  key={m}
                  href={`https://github.com/${m}`}
                  className="follow-link--underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  @{m}
                </a>
              ))}
            </span>
          </div>
          <div className="flex flex-1 items-center text-sm">
            <i className="i-mingcute-tag-2-line mr-1 shrink-0 translate-y-1 self-start" />
            <span className="flex flex-wrap gap-1">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="cursor-pointer rounded bg-muted/50 px-1.5 duration-200 hover:bg-muted"
                >
                  {c}
                </button>
              ))}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})
