import { EmptyIcon } from "@follow/components/icons/empty.jsx"
import type { HTMLMotionProps } from "framer-motion"
import type { DOMAttributes, FC } from "react"
import { forwardRef, memo, useCallback } from "react"
import { useTranslation } from "react-i18next"
import type { VirtuosoHandle, VirtuosoProps } from "react-virtuoso"
import { GroupedVirtuoso, Virtuoso } from "react-virtuoso"

import { useGeneralSettingKey } from "~/atoms/settings/general"
import { m } from "~/components/common/Motion"
import { ReactVirtuosoItemPlaceholder } from "~/components/ui/placeholder"
import { useRouteParams } from "~/hooks/biz/useRouteParams"
import { useEntry } from "~/store/entry"
import { isListSubscription } from "~/store/subscription"

import { DateItem } from "./components/DateItem"
import { EntryColumnShortcutHandler } from "./EntryColumnShortcutHandler"

export const EntryListContent = forwardRef<HTMLDivElement>((props, ref) => (
  <div className="px-2" {...props} ref={ref} />
))

export const EntryEmptyList = forwardRef<HTMLDivElement, HTMLMotionProps<"div">>((props, ref) => {
  const unreadOnly = useGeneralSettingKey("unreadOnly")
  const { t } = useTranslation()
  return (
    <m.div
      className="absolute -mt-6 flex size-full grow flex-col items-center justify-center gap-2 text-zinc-400"
      {...props}
      ref={ref}
    >
      {unreadOnly ? (
        <>
          <i className="i-mgc-celebrate-cute-re -mt-11 text-3xl" />
          <span className="text-base">{t("entry_list.zero_unread")}</span>
        </>
      ) : (
        <div className="flex -translate-y-6 flex-col items-center justify-center gap-2">
          <EmptyIcon className="size-[30px]" />
          <span className="text-base">{t("words.zero_items")}</span>
        </div>
      )}
    </m.div>
  )
})

type BaseEntryProps = {
  virtuosoRef: React.RefObject<VirtuosoHandle>
  refetch: () => void
}
type EntryListProps = VirtuosoProps<string, unknown> & {
  groupCounts?: number[]
} & BaseEntryProps
export const EntryList: FC<EntryListProps> = memo(
  ({
    virtuosoRef,
    refetch,
    groupCounts,

    ...virtuosoOptions
  }) => {
    // Prevent scroll list move when press up/down key, the up/down key should be taken over by the shortcut key we defined.
    const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = useCallback((e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault()
      }
    }, [])

    return (
      <>
        {groupCounts ? (
          <EntryGroupedList
            groupCounts={groupCounts}
            onKeyDown={handleKeyDown}
            {...virtuosoOptions}
            ref={virtuosoRef}
          />
        ) : (
          <Virtuoso onKeyDown={handleKeyDown} {...virtuosoOptions} ref={virtuosoRef} />
        )}
        <EntryColumnShortcutHandler
          refetch={refetch}
          data={virtuosoOptions.data!}
          virtuosoRef={virtuosoRef}
        />
      </>
    )
  },
)

const EntryGroupedList = forwardRef<
  VirtuosoHandle,
  VirtuosoProps<string, unknown> &
    DOMAttributes<HTMLDivElement> & {
      groupCounts: number[]
    }
>(({ groupCounts, itemContent, onKeyDown, data, totalCount, ...virtuosoOptions }, ref) => (
  <GroupedVirtuoso
    ref={ref}
    groupContent={useCallback(
      (index: number) => {
        const entryId = getGetGroupDataIndex(groupCounts!, index, data!)

        return <EntryHeadDateItem entryId={entryId} />
      },
      [groupCounts, data],
    )}
    groupCounts={groupCounts}
    onKeyDown={onKeyDown}
    {...virtuosoOptions}
    itemContent={useCallback(
      (index: number, _: number, __: string, c: any) => {
        const entryId = data![index]
        return itemContent?.(index, entryId, c)
      },
      [itemContent, JSON.stringify(data)],
    )}
  />
))

function getGetGroupDataIndex<T>(groupCounts: number[], groupIndex: number, data: readonly T[]) {
  // Get first grouped of data index
  //
  let sum = 0
  for (let i = 0; i < groupIndex; i++) {
    sum += groupCounts[i]
  }
  return data[sum]
}

const EntryHeadDateItem: FC<{
  entryId: string
}> = memo(({ entryId }) => {
  const entry = useEntry(entryId)

  const routeParams = useRouteParams()
  const { feedId, view } = routeParams
  const isList = isListSubscription(feedId)

  if (!entry) return <ReactVirtuosoItemPlaceholder />
  const date = new Date(
    isList ? entry.entries.insertedAt : entry.entries.publishedAt,
  ).toDateString()
  return <DateItem date={date} view={view} />
})

EntryHeadDateItem.displayName = "EntryHeadDateItem"
