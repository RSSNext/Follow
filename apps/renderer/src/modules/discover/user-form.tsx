import { LoadingCircle } from "@renderer/components/ui/loading"
import { useAuthQuery } from "@renderer/hooks/common"
import { Queries } from "@renderer/queries"

import { DiscoverFeedForm } from "./DiscoverFeedForm"

export function DiscoverUser() {
  const { data, isLoading } = useAuthQuery(
    Queries.discover.rsshubNamespace({
      namespace: "follow",
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
        <LoadingCircle size="large" />
      </div>
    )
  }

  return (
    <>
      {data?.follow.routes && (
        <div className="w-[512px]">
          <DiscoverFeedForm
            routePrefix="follow"
            route={data.follow.routes[Object.keys(data.follow.routes)[0]]}
            noDescription
            submitButtonClassName="justify-center"
          />
        </div>
      )}
    </>
  )
}
