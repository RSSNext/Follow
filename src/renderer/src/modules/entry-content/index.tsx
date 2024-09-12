import { repository } from "@pkg"
import {
  ReadabilityStatus,
  useEntryInReadabilityStatus,
  useEntryIsInReadability,
  useEntryReadabilityContent,
} from "@renderer/atoms/readability"
import { useUISettingKey } from "@renderer/atoms/settings/ui"
import { useWhoami } from "@renderer/atoms/user"
import { m } from "@renderer/components/common/Motion"
import { ShadowDOM } from "@renderer/components/common/ShadowDOM"
import { AutoResizeHeight } from "@renderer/components/ui/auto-resize-height"
import { HTML } from "@renderer/components/ui/markdown"
import { Toc } from "@renderer/components/ui/markdown/components/Toc"
import { useInPeekModal } from "@renderer/components/ui/modal/inspire/PeekModal"
import { RootPortal } from "@renderer/components/ui/portal"
import { ScrollArea } from "@renderer/components/ui/scroll-area"
import { isWebBuild, ROUTE_FEED_PENDING } from "@renderer/constants"
import { shortcuts } from "@renderer/constants/shortcuts"
import { useEntryReadabilityToggle } from "@renderer/hooks/biz/useEntryActions"
import { useRouteParamsSelector, useRouteParms } from "@renderer/hooks/biz/useRouteParams"
import { useAuthQuery, useTitle } from "@renderer/hooks/common"
import { stopPropagation } from "@renderer/lib/dom"
import { FeedViewType } from "@renderer/lib/enum"
import { getNewIssueUrl } from "@renderer/lib/issues"
import { cn } from "@renderer/lib/utils"
import type { ActiveEntryId } from "@renderer/models"
import {
  useIsSoFWrappedElement,
  useWrappedElement,
  WrappedElementProvider,
} from "@renderer/providers/wrapped-element-provider"
import { Queries } from "@renderer/queries"
import { useEntry, useEntryReadHistory } from "@renderer/store/entry"
import { getPreferredTitle, useFeedById, useFeedHeaderTitle } from "@renderer/store/feed"
import type { FallbackRender } from "@sentry/react"
import { ErrorBoundary } from "@sentry/react"
import type { FC } from "react"
import { useEffect, useLayoutEffect, useRef } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import {useTranslation  } from "react-i18next"

import { LoadingWithIcon } from "../../components/ui/loading"
import { EntryPlaceholderDaily } from "../ai/ai-daily/EntryPlaceholderDaily"
import { EntryTranslation } from "../entry-column/translation"
import { setEntryContentScrollToTop, setEntryTitleMeta } from "./atoms"
import { EntryPlaceholderLogo } from "./components/EntryPlaceholderLogo"
import { EntryHeader } from "./header"
import { EntryContentLoading } from "./loading"
import { EntryContentProvider } from "./provider"

export const EntryContent = ({ entryId }: { entryId: ActiveEntryId }) => {
  const title = useFeedHeaderTitle()
  const { feedId, view } = useRouteParms()

  useTitle(title)
  if (!entryId) {
    return (
      <m.div
        className="center size-full flex-col"
        initial={{ opacity: 0.01, y: 300 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <EntryPlaceholderLogo />
        {feedId === ROUTE_FEED_PENDING && view === FeedViewType.Articles && (
          <EntryPlaceholderDaily view={view} />
        )}
      </m.div>
    )
  }

  return <EntryContentRender entryId={entryId} />
}

export const EntryContentRender: Component<{ entryId: string }> = ({ entryId, className }) => {
  const { t } = useTranslation()
  const user = useWhoami()

  const { error, data, isPending } = useAuthQuery(Queries.entries.byId(entryId), {
    staleTime: 300_000,
  })

  const entry = useEntry(entryId)
  useTitle(entry?.entries.title)

  const feed = useFeedById(entry?.feedId)

  const entryHistory = useEntryReadHistory(entryId)

  const readerRenderInlineStyle = useUISettingKey("readerRenderInlineStyle")

  const translation = useAuthQuery(
    Queries.ai.translation({
      entry: entry!,
      language: entry?.settings?.translation,
      extraFields: ["title"],
    }),
    {
      enabled: !!entry?.settings?.translation,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      meta: {
        persist: true,
      },
    },
  )

  const summary = useAuthQuery(
    Queries.ai.summary({
      entryId,
      language: entry?.settings?.translation,
    }),
    {
      enabled: !!entry?.settings?.summary,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      meta: {
        persist: true,
      },
    },
  )

  const readerFontFamily = useUISettingKey("readerFontFamily")
  const view = useRouteParamsSelector((route) => route.view)

  const isInReadabilityMode = useEntryIsInReadability(entryId)
  const scrollerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    scrollerRef.current?.scrollTo(0, 0)
  }, [entryId])

  useHotkeys(shortcuts.entry.scrollDown.key, () => {
    scrollerRef.current?.scrollBy(0, window.innerHeight / 2)
  })

  useHotkeys(shortcuts.entry.scrollUp.key, () => {
    scrollerRef.current?.scrollBy(0, -window.innerHeight / 2)
  })

  const isPeekModal = useInPeekModal()

  if (!entry) return null

  const content = entry?.entries.content ?? data?.entries.content

  return (
    <EntryContentProvider
      entryId={entry.entries.id}
      feedId={entry.feedId}
      audioSrc={entry.entries?.attachments?.[0].url}
      view={view}
    >
      <EntryHeader
        entryId={entry.entries.id}
        view={0}
        className="h-[55px] shrink-0 px-3 @container"
      />

      <ScrollArea.ScrollArea
        mask={false}
        rootClassName={cn("h-0 min-w-0 grow overflow-y-auto @container", className)}
        scrollbarClassName="mr-[1.5px]"
        viewportClassName="p-5"
        ref={scrollerRef}
      >
        <div
          style={
            readerFontFamily
              ? {
                  fontFamily: readerFontFamily,
                }
              : undefined
          }
          className="duration-200 ease-in-out animate-in fade-in slide-in-from-bottom-24 f-motion-reduce:fade-in-0 f-motion-reduce:slide-in-from-bottom-0"
          key={entry.entries.id}
        >
          <article
            onContextMenu={stopPropagation}
            className="relative m-auto min-w-0 max-w-[550px] @3xl:max-w-[70ch]"
          >
            <a
              href={entry.entries.url || void 0}
              target="_blank"
              className="-mx-6 block cursor-default rounded-lg p-6 transition-colors hover:bg-theme-item-hover focus-visible:bg-theme-item-hover focus-visible:!outline-none @sm:-mx-3 @sm:p-3"
              rel="noreferrer"
            >
              <div className="select-text break-words text-3xl font-bold">
                <EntryTranslation source={entry.entries.title} target={translation.data?.title} />
              </div>
              <div className="mt-2 text-[13px] font-medium text-zinc-500">
                {getPreferredTitle(feed)}
              </div>
              <div className="flex items-center gap-2 text-[13px] text-zinc-500">
                {entry.entries.publishedAt && new Date(entry.entries.publishedAt).toLocaleString()}

                <div className="flex items-center gap-1">
                  <i className="i-mgc-eye-2-cute-re" />
                  <span>
                    {(
                      (entryHistory?.readCount ?? 0) +
                      (entryHistory?.userIds?.every((id) => id !== user?.id) ? 1 : 0)
                    ) // if no me, +1
                      .toLocaleString()}
                  </span>
                </div>
              </div>
            </a>

            <WrappedElementProvider boundingDetection>
              <div className="mx-auto mb-32 mt-8 max-w-full cursor-auto select-text break-all text-[0.94rem]">
                <TitleMetaHandler entryId={entry.entries.id} />
                {(summary.isLoading || summary.data) && (
                  <div className="my-8 space-y-1 rounded-lg border px-4 py-3">
                    <div className="flex items-center gap-2 font-medium text-zinc-800 dark:text-neutral-400">
                      <i className="i-mgc-magic-2-cute-re align-middle" />
                      <span>{t("entry_content.ai_summary")}</span>
                    </div>
                    <AutoResizeHeight spring className="text-sm leading-relaxed">
                      {summary.isLoading ? SummaryLoadingSkeleton : summary.data}
                    </AutoResizeHeight>
                  </div>
                )}
                <ErrorBoundary fallback={RenderError}>
                  {!isInReadabilityMode ? (
                    <ShadowDOM>
                      <HTML
                        accessory={isPeekModal ? undefined : <ContainerToc key={entryId} />}
                        as="article"
                        className="prose !max-w-full dark:prose-invert prose-h1:text-[1.6em]"
                        style={
                          readerFontFamily
                            ? {
                                fontFamily: readerFontFamily,
                              }
                            : undefined
                        }
                        renderInlineStyle={readerRenderInlineStyle}
                      >
                        {content}
                      </HTML>
                    </ShadowDOM>
                  ) : (
                    <ReadabilityContent entryId={entryId} />
                  )}
                </ErrorBoundary>
              </div>
            </WrappedElementProvider>

            {!content && (
              <div className="center mt-16">
                {isPending ? (
                  <EntryContentLoading icon={feed?.siteUrl!} />
                ) : error ? (
                  <div className="center flex flex-col gap-2">
                    <i className="i-mgc-close-cute-re text-3xl text-red-500" />
                    <span className="font-sans text-sm">Network Error</span>

                    <pre>{error.message}</pre>
                  </div>
                ) : (
                  <NoContent id={entry.entries.id} url={entry.entries.url ?? ""} />
                )}
              </div>
            )}
          </article>
        </div>
      </ScrollArea.ScrollArea>
    </EntryContentProvider>
  )
}

const SummaryLoadingSkeleton = (
  <div className="space-y-2">
    <span className="block h-3 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-neutral-800" />
    <span className="block h-3 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-neutral-800" />
    <span className="block h-3 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-neutral-800" />
  </div>
)

const TitleMetaHandler: Component<{
  entryId: string
}> = ({ entryId }) => {
  const {
    entries: { title: entryTitle },
    feedId,
  } = useEntry(entryId)!

  const { title: feedTitle } = useFeedById(feedId)!

  const atTop = useIsSoFWrappedElement()
  useEffect(() => {
    setEntryContentScrollToTop(true)
  }, [entryId])
  useLayoutEffect(() => {
    setEntryContentScrollToTop(atTop)
  }, [atTop])

  useEffect(() => {
    if (entryTitle && feedTitle) {
      setEntryTitleMeta({ title: entryTitle, description: feedTitle })
    }
    return () => {
      setEntryTitleMeta(null)
    }
  }, [entryId, entryTitle, feedTitle])
  return null
}

const ReadabilityContent = ({ entryId }: { entryId: string }) => {
  const { t } = useTranslation()
  const result = useEntryReadabilityContent(entryId)

  return (
    <div className="grow">
      {result ? (
        <p className="rounded-xl border p-3 text-sm opacity-80">
          <i className="i-mgc-information-cute-re mr-1 translate-y-[2px]" />
          {t("entry_content.readability_notice")}
        </p>
      ) : (
        <div className="center mt-16 flex flex-col gap-2">
          <LoadingWithIcon size="large" icon={<i className="i-mgc-sparkles-2-cute-re" />} />
          <span className="text-sm">{t("entry_content.fetching_content")}</span>
        </div>
      )}

      <HTML as="article" className="prose dark:prose-invert prose-h1:text-[1.6em]">
        {result?.content ?? ""}
      </HTML>
    </div>
  )
}

const NoContent: FC<{
  id: string
  url: string
}> = ({ id, url }) => {
  const status = useEntryInReadabilityStatus(id)

  if (status !== ReadabilityStatus.INITIAL && status !== ReadabilityStatus.FAILURE) {
    return null
  }
  return (
    <div className="center">
      <div className="space-y-2 text-balance text-center text-sm text-zinc-400">
        {(isWebBuild || status === ReadabilityStatus.FAILURE) && <span>No content</span>}
        {isWebBuild && (
          <div>
            <span>
              Maybe web app doesn't support this content type. But you can{" "}
              <a
                target="_blank"
                rel="noreferrer"
                className="text-accent underline"
                href={`${repository.url}/releases`}
              >
                download
              </a>{" "}
              the desktop app.
            </span>
          </div>
        )}
        {url && window.electron && <ReadabilityAutoToggle url={url} id={id} />}
      </div>
    </div>
  )
}

const ReadabilityAutoToggle = ({ url, id }: { url: string; id: string }) => {
  const toggle = useEntryReadabilityToggle({
    id,
    url,
  })
  const onceRef = useRef(false)

  useEffect(() => {
    if (!onceRef.current) {
      onceRef.current = true
      toggle()
    }
  }, [toggle])

  return null
}

const RenderError: FallbackRender = ({ error }) => {
  const { t } = useTranslation()
  const nextError = typeof error === "string" ? new Error(error) : (error as Error)
  return (
    <div className="center mt-16 flex flex-col gap-2">
      <i className="i-mgc-close-cute-re text-3xl text-red-500" />
      <span className="font-sans text-sm">
        {t("entry_content.render_error")} {nextError.message}
      </span>
      <a
        href={getNewIssueUrl({
          body: [
            "### Error",
            "",
            nextError.message,
            "",
            "### Stack",
            "",
            "```",
            nextError.stack,
            "```",
          ].join("\n"),
          label: "bug",
          title: "Render error",
        })}
        target="_blank"
        rel="noreferrer"
      >
        {t("entry_content.report_issue")}
      </a>
    </div>
  )
}

const ContainerToc: FC = () => {
  const wrappedElement = useWrappedElement()
  return (
    <RootPortal to={wrappedElement!}>
      <div className="group absolute right-[-130px] top-0 h-full w-[100px]">
        <div className="sticky top-0">
          <Toc
            className={cn(
              "flex flex-col items-end animate-in fade-in-0 slide-in-from-bottom-12 easing-spring spring-soft",
              "max-h-[calc(100vh-100px)] overflow-auto scrollbar-none",

              "@[500px]:-translate-x-12",
              "@[700px]:-translate-x-12 @[800px]:-translate-x-16 @[900px]:translate-x-0 @[900px]:items-start",
            )}
          />
        </div>
      </div>
    </RootPortal>
  )
}
