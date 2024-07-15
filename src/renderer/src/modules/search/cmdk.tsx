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
import { useNavigateEntry } from "@renderer/hooks/biz/useNavigateEntry"
import { ROUTE_ENTRY_PENDING } from "@renderer/lib/constants"
import { cn } from "@renderer/lib/utils"
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
import { useHotkeys } from "react-hotkeys-hook"

const SearchCmdKContext = React.createContext<Promise<SearchInstance> | null>(
  null,
)
export const SearchCmdK: React.FC = () => {
  const [open, setOpen] = React.useState(false)
  useHotkeys("meta+k,ctrl+k", () => {
    setOpen((o) => !o)
  })
  const searchInstance = useMemo(() => searchActions.createLocalDbSearch(), [])

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
        setOpen(false)
        return
      }

      if (e.key === "ArrowDown" || e.key === "ArrowUp") return

      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        $input?.focus()
      }
    }, [])
  return (
    <SearchCmdKContext.Provider value={searchInstance}>
      <Command.Dialog
        ref={dialogRef}
        shouldFilter={false}
        open={open}
        onKeyDown={handleKeyDownToFocusInput}
        onOpenChange={setOpen}
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
          placeholder={searchActions.getCurrentKeyword()}
          onValueChange={async (value) => {
            const { search } = await searchInstance
            search(value)
            const $scrollView = scrollViewRef.current
            if ($scrollView) {
              $scrollView.scrollTop = 0
            }
          }}
        />

        <ScrollArea.ScrollArea
          ref={scrollViewRef}
          viewportClassName="max-h-[50vh] px-5 [&>div]:!flex"
          rootClassName="h-full"
        >
          <Command.List className="flex w-full min-w-0 flex-col">
            <SearchPlaceholder />

            {entries.length > 0 && (
              <Command.Group
                heading={(
                  <SearchGroupHeading
                    icon="i-mgc-paper-cute-fi size-4"
                    title="Entries"
                  />
                )}
                className="flex w-full min-w-0 flex-col py-2"
              >
                {entries.map((entry, index) => {
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
            {feeds.length > 0 && (
              <Command.Group
                heading={(
                  <SearchGroupHeading
                    icon="i-mgc-rss-cute-fi size-4 text-theme-accent"
                    title="Feeds"
                  />
                )}
                className="py-2"
              >
                {feeds.map((feed, index) => (
                  <SearchItem
                    key={feed.item.id}
                    title={feed.item.title!}
                    feedId={feed.item.id!}
                    entryId={ROUTE_ENTRY_PENDING}
                    id={feed.item.id!}
                    index={entries.length + index}
                    icon={feed.item.siteUrl}
                    subtitle={useFeedUnreadStore.getState().data[feed.item.id!]?.toString()}
                  />
                ))}
              </Command.Group>
            )}
          </Command.List>
        </ScrollArea.ScrollArea>
        <SearchOptions />
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
        <span className="block min-w-0 shrink-0 grow-0 text-xs font-medium text-zinc-800 opacity-80 dark:text-slate-200/80">
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

const SearchOptions = () => {
  const searchType = useSearchStore((s) => s.searchType)

  const searchInstance = React.useContext(SearchCmdKContext)
  const hasKeyword = useSearchStore((s) => !!s.keyword)
  return (
    <div className="absolute bottom-2 left-4 flex items-center gap-2 text-sm">
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

      {hasKeyword && (
        <small className="shrink-0 opacity-80">
          This search run on local database, the result may not be up-to-date.
        </small>
      )}
    </div>
  )
}

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
