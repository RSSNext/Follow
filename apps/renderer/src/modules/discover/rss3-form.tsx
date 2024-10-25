import { LoadingCircle } from "@follow/components/ui/loading/index.jsx"
import { TokenBrandedRss3 } from "@follow/components/ui/platform-icon/icons.js"

import { useAuthQuery } from "~/hooks/common"
import { Queries } from "~/queries"

import { DiscoverFeedForm } from "./DiscoverFeedForm"

export function DiscoverRSS3() {
  const { data, isLoading } = useAuthQuery(
    Queries.discover.rsshubNamespace({
      namespace: "rss3",
    }),
    {
      meta: {
        persist: true,
      },
    },
  )

  if (isLoading) {
    return (
      <div className="center mt-12 flex w-full flex-col gap-8">
        <TokenBrandedRss3 className="size-[50px]" />
        <LoadingCircle size="large" />
      </div>
    )
  }

  return (
    <>
      {data?.rss3.routes && (
        <div className="w-[540px]">
          <DiscoverFeedForm
            routePrefix="rss3"
            route={data.rss3.routes[Object.keys(data.rss3.routes)[0]]}
            noDescription
            submitButtonClassName="justify-center"
          />
        </div>
      )}
    </>
  )
}
