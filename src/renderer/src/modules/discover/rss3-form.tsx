import {
  LoadingWithIcon,
} from "@renderer/components/ui/loading"
import { TokenBrandedRss3 } from "@renderer/components/ui/platform-icon/icons"
import { useAuthQuery } from "@renderer/hooks/common"
import { Queries } from "@renderer/queries"

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
      <LoadingWithIcon
        icon={<TokenBrandedRss3 />}
        size="large"
        className="center flex w-full"
      />
    )
  }

  return (
    <>
      {data?.rss3.routes && (
        <div className="w-[512px]">
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
