import { setAppSearchOpen, useAppSearchOpen } from "@renderer/atoms/app"
import { LoadMoreIndicator } from "@renderer/components/common/LoadMoreIndicator"
import { EmptyIcon } from "@renderer/components/icons/empty"
import { Logo } from "@renderer/components/icons/logo"
import { SiteIcon } from "@renderer/components/site-icon"
import { ScrollArea } from "@renderer/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip"
import { useNavigateEntry } from "@renderer/hooks/biz/useNavigateEntry"
import { ROUTE_ENTRY_PENDING } from "@renderer/lib/constants"
import { cn, pluralize } from "@renderer/lib/utils"
import { getFeedById } from "@renderer/store/feed"
import { searchActions, useSearchStore } from "@renderer/store/search"
import { SearchType } from "@renderer/store/search/constants"
import type { SearchInstance } from "@renderer/store/search/types"
import { useFeedUnreadStore } from "@renderer/store/unread"
import clsx from "clsx"
import { Command } from "cmdk"
import type { FC } from "react"
import * as React from "react"
import { memo, useMemo } from "react"

import styles from "./cmdk.module.css"

const SearchCmdKContext = React.createContext<Promise<SearchInstance> | null>(
  null,
)
export const SearchCmdK: React.FC = () => {
  const open = useAppSearchOpen()

  const [searchInstance, setSearchInstance] = React.useState(() =>
    searchActions.createLocalDbSearch(),
  )
  React.useEffect(() => {
    if (!open) return
    // Refresh data
    setPage(0)
    setSearchInstance(() => searchActions.createLocalDbSearch())
  }, [open])

  const entries = useSearchStore((s) => s.entries)
  const feeds = useSearchStore((s) => s.feeds)

  const inputRef = React.useRef<HTMLInputElement>(null)
  const dialogRef = React.useRef<HTMLDivElement>(null)
  const scrollViewRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const $input = inputRef.current
    if (open && $input) {
      $input.focus()
    }
  }, [open])
  const handleKeyDownToFocusInput: React.EventHandler<React.KeyboardEvent> =
    React.useCallback((e) => {
      const $input = inputRef.current
      if (e.key === "Escape") {
        setAppSearchOpen(false)
        return
      }

      if (e.key === "ArrowDown" || e.key === "ArrowUp") return

      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        $input?.focus()
      }
    }, [])
  const [isPending, startTransition] = React.useTransition()
  const handleSearch = React.useCallback(
    async (value: string) => {
      const { search } = await searchInstance
      setPage(0)
      startTransition(() => {
        search(value)
        const $scrollView = scrollViewRef.current
        if ($scrollView) {
          $scrollView.scrollTop = 0
        }
      })
    },
    [searchInstance],
  )
  // Performance optimization
  const [page, setPage] = React.useState(0)
  const pageSize = 16
  const renderedEntries = useMemo(
    () => entries.slice(0, (page + 1) * pageSize),
    [entries, page],
  )

  const renderedFeeds = useMemo(() => {
    const delta = entries.length - renderedEntries.length
    if (delta > pageSize) return []

    const entriesTotalPage = Math.ceil(entries.length / pageSize)
    const right =
      entriesTotalPage === page + 1 ? delta : pageSize * page - entries.length
    return feeds.slice(0, right)
  }, [entries.length, feeds, page, renderedEntries.length])
  const totalCount = entries.length + feeds.length
  const renderedTotalCount = renderedEntries.length + renderedFeeds.length
  const loadMore = React.useCallback(() => {
    const totalPage = Math.ceil((entries.length + feeds.length) / pageSize)
    setPage((p) => {
      if (p + 1 < totalPage) return p + 1
      return p
    })
  }, [entries.length, feeds.length])

  const canLoadMore = totalCount > renderedTotalCount
  return (
    <SearchCmdKContext.Provider value={searchInstance}>
      <Command.Dialog
        ref={dialogRef}
        shouldFilter={false}
        open={open}
        onKeyDown={handleKeyDownToFocusInput}
        onOpenChange={setAppSearchOpen}
        className={cn(
          "h-[600px] max-h-[80vh] w-[800px] max-w-[100vw] rounded-none md:h-screen md:max-h-[60vh] md:max-w-[80vw]",
          "flex min-h-[50vh] flex-col bg-zinc-50/85 shadow-2xl backdrop-blur-md dark:bg-neutral-900/80 md:rounded-xl",
          "border-0 border-zinc-200 dark:border-zinc-800 md:border",
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
        )}
      >
        <Command.Input
          className="w-full shrink-0 border-b border-zinc-200 bg-transparent p-4 px-5 text-lg leading-4 dark:border-neutral-700"
          ref={inputRef}
          placeholder={searchActions.getCurrentKeyword() || "Search..."}
          onValueChange={handleSearch}
        />
        <div
          className={cn(styles["status-bar"], isPending && styles["loading"])}
        />

        <ScrollArea.ScrollArea
          ref={scrollViewRef}
          viewportClassName="max-h-[50vh] px-5 [&>div]:!flex"
          rootClassName="h-full"
        >
          <Command.List className="flex w-full min-w-0 flex-col">
            <SearchPlaceholder />

            {renderedEntries.length > 0 && (
              <Command.Group
                heading={(
                  <SearchGroupHeading
                    icon="i-mgc-paper-cute-fi size-4"
                    title="Entries"
                  />
                )}
                className="flex w-full min-w-0 flex-col py-2"
              >
                {renderedEntries.map((entry, index) => {
                  const feed = getFeedById(entry.feedId)
                  return (
                    <SearchItem
                      key={entry.item.id}
                      title={entry.item.title!}
                      feedId={entry.feedId}
                      entryId={entry.item.id}
                      id={entry.item.id}
                      index={index}
                      icon={feed?.siteUrl}
                      subtitle={feed?.title}
                    />
                  )
                })}
              </Command.Group>
            )}
            {renderedFeeds.length > 0 && (
              <Command.Group
                heading={(
                  <SearchGroupHeading
                    icon="i-mgc-rss-cute-fi size-4 text-theme-accent"
                    title="Feeds"
                  />
                )}
                className="py-2"
              >
                {renderedFeeds.map((feed, index) => (
                  <SearchItem
                    key={feed.item.id}
                    title={feed.item.title!}
                    feedId={feed.item.id!}
                    entryId={ROUTE_ENTRY_PENDING}
                    id={feed.item.id!}
                    index={entries.length + index}
                    icon={feed.item.siteUrl}
                    subtitle={useFeedUnreadStore
                      .getState()
                      .data[feed.item.id!]?.toString()}
                  />
                ))}
              </Command.Group>
            )}
            {canLoadMore && (
              <LoadMoreIndicator
                className="center w-full"
                onLoading={loadMore}
              />
            )}
          </Command.List>
        </ScrollArea.ScrollArea>
        <SearchOptions>
          <SearchResultCount count={totalCount} />
        </SearchOptions>
      </Command.Dialog>
    </SearchCmdKContext.Provider>
  )
}

type SearchListType = {
  title: string
  subtitle?: Nullable<string>
  feedId?: string
  entryId?: string
  icon?: Nullable<string>
  id: string
}

const SearchItem = memo(function Item({
  index,
  ...item
}: {
  index: number
} & SearchListType) {
  const navigateEntry = useNavigateEntry()
  return (
    <Command.Item
      className={clsx(
        "relative flex w-full justify-between px-1 text-[0.9rem]",
        "before:absolute before:inset-0 before:rounded-md before:content-auto",
        "before:z-0 hover:before:bg-zinc-200/60 dark:hover:before:bg-zinc-800/80",
        "data-[selected=true]:before:bg-zinc-200/60 data-[selected=true]:dark:before:bg-zinc-800/80",
        "min-w-0 max-w-full",
        styles["content-visually"],
      )}
      key={item.id}
      onSelect={() => {
        navigateEntry({
          feedId: item.feedId!,
          entryId: item.entryId,
        })
      }}
    >
      <div className="relative z-10 flex w-full items-center justify-between px-1 py-2">
        {item.icon && (
          <SiteIcon className="mr-2 size-5 shrink-0" url={item.icon} />
        )}
        <span className="block min-w-0 flex-1 shrink-0 truncate">
          {item.title}
        </span>
        <span className="block min-w-0 shrink-0 grow-0 text-xs font-medium text-zinc-800 opacity-60 dark:text-slate-200/80">
          {item.subtitle}
        </span>
      </div>
    </Command.Item>
  )
})

const SearchGroupHeading: FC<{ icon: string, title: string }> = ({
  icon,
  title,
}) => (
  <div className="mb-2 flex items-center gap-2">
    <i className={icon} />
    <span className="text-sm font-semibold">{title}</span>
  </div>
)

const SearchResultCount: FC<{
  count?: number
}> = ({ count }) => {
  const hasKeyword = useSearchStore((s) => !!s.keyword)
  if (!count) return null
  return (
    hasKeyword && (
      <Tooltip>
        <TooltipTrigger asChild>
          <small className="shrink-0 opacity-80">
            {count}
            {" "}
            {pluralize("result", count)}
          </small>
        </TooltipTrigger>
        <TooltipContent>
          This search run on local database, the result may not be up-to-date.
        </TooltipContent>
      </Tooltip>
    )
  )
}
const SearchOptions: Component = memo(({ children }) => {
  const searchType = useSearchStore((s) => s.searchType)

  const searchInstance = React.useContext(SearchCmdKContext)

  return (
    <div className="absolute bottom-2 left-4 flex items-center gap-2 text-sm text-theme-foreground/80">
      <span className="shrink-0">Search Type</span>

      <Select
        onValueChange={async (value) => {
          searchActions.setSearchType(+value as SearchType)

          if (searchInstance) {
            const { search } = await searchInstance
            search(searchActions.getCurrentKeyword())
          }
        }}
        value={`${searchType}`}
      >
        <SelectTrigger size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            className="hover:bg-theme-item-hover"
            value={`${SearchType.All}`}
            disabled={searchType === SearchType.All}
          >
            All
          </SelectItem>
          <SelectItem
            className="hover:bg-theme-item-hover"
            value={`${SearchType.Entry}`}
            disabled={searchType === SearchType.Entry}
          >
            Entries
          </SelectItem>
          <SelectItem
            className="hover:bg-theme-item-hover"
            value={`${SearchType.Feed}`}
            disabled={searchType === SearchType.Feed}
          >
            Feeds
          </SelectItem>
        </SelectContent>
      </Select>

      {children}
    </div>
  )
})

const SearchPlaceholder = () => {
  const hasKeyword = useSearchStore((s) => !!s.keyword)
  return (
    <Command.Empty className="center absolute inset-0">
      {hasKeyword ? (
        <div className="flex flex-col items-center justify-center gap-2 opacity-80">
          <EmptyIcon />
          No results found.
        </div>
      ) : (
        <Logo className="size-12 opacity-80 grayscale" />
      )}
    </Command.Empty>
  )
}
