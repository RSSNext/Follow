/* eslint-disable react-refresh/only-export-components */
import { useSingleton } from "foxact/use-singleton"
import type { FC } from "react"
import { createContext, createElement, useContext } from "react"
import { useEventCallback } from "usehooks-ts"

import type { ModalActionsInternal } from "~/components/ui/modal"
import { useModalStack } from "~/components/ui/modal"
import type { UseAsyncFetcher } from "~/components/ui/modal/helper/async-loading"
import { AsyncModalContent } from "~/components/ui/modal/helper/async-loading"
import { NoopChildren } from "~/components/ui/modal/stacked/custom-modal"
import { useTypeScriptHappyCallback } from "~/hooks/common"

export type AsyncModalOptions<T> = {
  id: string
  title: ((data: T) => string) | string
  icon?: (data: T) => React.ReactNode
  useDataFetcher: () => UseAsyncFetcher<T>
  content: FC<ModalActionsInternal & { data: T }>
}
const AsyncModalContext = createContext<AsyncModalOptions<any>>(null!)
export const useAsyncModal = () => {
  const { present } = useModalStack()

  return useEventCallback(<T,>(options: AsyncModalOptions<T>) => {
    present({
      id: options.id,
      content: () => (
        <AsyncModalContext.Provider value={options}>
          <LazyContent />
        </AsyncModalContext.Provider>
      ),
      title: "Loading...",
      CustomModalComponent: NoopChildren,
    })
  })
}

const LazyContent = () => {
  const ctx = useContext(AsyncModalContext)
  const queryResult = ctx.useDataFetcher()

  return (
    <AsyncModalContent
      queryResult={queryResult}
      renderContent={useTypeScriptHappyCallback(
        (data) => (
          <Presentable data={data} />
        ),
        [],
      )}
    />
  )
}

const Presentable: FC<{
  data: any
}> = ({ data }) => {
  const { present, dismissTop } = useModalStack()
  const ctx = useContext(AsyncModalContext)

  useSingleton(() => {
    dismissTop()
    present({
      id: `presentable-${ctx.id}`,
      content: (props) => createElement(ctx.content, { data, ...props }),
      title: typeof ctx.title === "function" ? ctx.title(data) : ctx.title,
      icon: ctx.icon?.(data),
    })
  })
  return null
}
