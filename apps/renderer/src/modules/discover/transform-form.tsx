// routeParams

import { LoadingCircle } from "~/components/ui/loading"
import { TokenBrandedRss3 } from "~/components/ui/platform-icon/icons"
import { useAuthQuery } from "~/hooks/common"
import { Queries } from "~/queries"

import { DiscoverFeedForm } from "./DiscoverFeedForm"

const transformRouteParams = {
  title: "The title of the RSS",
  item: "The HTML elements as item using CSS selector",
  itemTitle: "The HTML elements as title in item using CSS selector",
  itemTitleAttr: "The attributes of title element as title",
  itemLink: "The HTML elements as link in item using CSS selector",
  itemLinkAttr: "The attributes of link element as link",
  itemDesc: "The HTML elements as descrption in item using CSS selector",
  itemDescAttr: "The attributes of descrption element as description",
  itemPubDate: "The HTML elements as pubDate in item using CSS selector",
  itemPubDateAttr: "The attributes of pubDate element as pubDate",
}

export function DiscoverTransform() {
  const { data, isLoading } = useAuthQuery(
    Queries.discover.rsshubNamespace({
      namespace: "rsshub",
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
      {data?.rsshub.routes && (
        <div className="w-[512px]">
          <DiscoverFeedForm
            routePrefix="rsshub"
            route={data?.rsshub.routes["/transform/html/:url/:routeParams"]}
            routeParams={transformRouteParams}
            noDescription
            submitButtonClassName="justify-center"
          />
        </div>
      )}
    </>
  )
}
