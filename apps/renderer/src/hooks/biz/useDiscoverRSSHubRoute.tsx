/* eslint-disable react-refresh/only-export-components */
import { useSingleton } from "foxact/use-singleton"
import type { FC } from "react"
import { useEventCallback } from "usehooks-ts"

import { useModalStack } from "~/components/ui/modal"
import { AsyncModalContent } from "~/components/ui/modal/helper/async-loading"
import { NoopChildren } from "~/components/ui/modal/stacked/custom-modal"
import { RecommendationContent } from "~/modules/discover/recommendation-content"
import type { RSSHubRoute } from "~/modules/discover/types"
import { discover } from "~/queries/discover"

import { useAuthQuery } from "../common"

export const useDiscoverRSSHubRouteModal = () => {
  const { present } = useModalStack()

  return useEventCallback((route: string) => {
    present({
      id: `rsshub-discover-${route}`,
      content: () => <LazyRSSHubDiscoverContent route={route} />,
      title: `Discover RSSHub Route`,
      CustomModalComponent: NoopChildren,
    })
  })
}

const LazyRSSHubDiscoverContent = ({ route }: { route: string }) => {
  const queryResult = useAuthQuery(discover.rsshubRoute({ route }))

  return (
    <AsyncModalContent
      queryResult={queryResult}
      renderContent={(data) => <Presentable prefix={data.prefix} route={data.route} />}
    />
  )
}

const Presentable: FC<{
  prefix: string
  route: RSSHubRoute
}> = (data) => {
  const { present, dismissTop } = useModalStack()
  useSingleton(() => {
    dismissTop()

    present({
      id: `rsshub-discover-presentable-${data.route}`,
      content: () => <RecommendationContent routePrefix={data.prefix} route={data.route} />,
      title: `Discover RSSHub Route`,
    })
  })
  return null
}
