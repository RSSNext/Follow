import { SiteIcon } from "@renderer/components/site-icon"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@renderer/components/ui/card"
import { useModalStack } from "@renderer/components/ui/modal/stacked/hooks"
import { useBizQuery } from "@renderer/hooks"
import { Queries } from "@renderer/queries"

import { RecommendationContent } from "./recommendation-content"

export function Recommendations() {
  const rsshubPopular = useBizQuery(Queries.discover.rsshubCategory({
    category: "popular",
  }))
  const { present } = useModalStack()

  return (
    <div className="mt-8">
      <div className="text-center text-lg font-medium">Popular</div>
      {rsshubPopular.data && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          {Object.keys(rsshubPopular.data).map((key) => (
            <Card key={key}>
              <CardHeader className="p-5 pb-3">
                <CardTitle className="flex items-center text-base">
                  <SiteIcon
                    url={`https://${rsshubPopular.data[key].url}`}
                  />
                  {rsshubPopular.data[key].name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <CardDescription>
                  <ul className="space-y-1">
                    {Object.keys(rsshubPopular.data[key].routes).map((route) => (
                      <li
                        key={route}
                        className="transition-colors hover:font-medium hover:text-zinc-800"
                        onClick={() => {
                          present({
                            content: () => <RecommendationContent route={rsshubPopular.data[key].routes[route]} />,
                            icon: (
                              <SiteIcon
                                className="size-4"
                                url={`https://${rsshubPopular.data[key].url}`}
                              />
                            ),
                            title: `${rsshubPopular.data[key].name} - ${rsshubPopular.data[key].routes[route].name}`,
                            clickOutsideToDismiss: true,
                          })
                        }}
                      >
                        {rsshubPopular.data[key].routes[route].name}
                      </li>
                    ))}
                  </ul>
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
