import { IN_ELECTRON } from "@follow/shared/constants"
import type { FallbackRender } from "@sentry/react"
import { ErrorBoundary } from "@sentry/react"
import type { FC } from "react"
import { memo, useEffect, useLayoutEffect, useMemo, useRef } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { useTranslation } from "react-i18next"

import {
  ReadabilityStatus,
  setReadabilityStatus,
  useEntryInReadabilityStatus,
  useEntryIsInReadability,
  useEntryReadabilityContent,
} from "~/atoms/readability"
import { useUISettingKey } from "~/atoms/settings/ui"
import { enableShowSourceContent } from "~/atoms/source-content"
import { m } from "~/components/common/Motion"
import { ShadowDOM } from "~/components/common/ShadowDOM"
import { AutoResizeHeight } from "~/components/ui/auto-resize-height"
import { Toc } from "~/components/ui/markdown/components/Toc"
import { useInPeekModal } from "~/components/ui/modal/inspire/PeekModal"
import { RootPortal } from "~/components/ui/portal"
import { ScrollArea } from "~/components/ui/scroll-area"
import { isWebBuild, ROUTE_FEED_PENDING } from "~/constants"
import { shortcuts } from "~/constants/shortcuts"
import { useEntryReadabilityToggle } from "~/hooks/biz/useEntryActions"
import { useRouteParams, useRouteParamsSelector } from "~/hooks/biz/useRouteParams"
import { useAuthQuery, useTitle } from "~/hooks/common"
import { stopPropagation } from "~/lib/dom"
import { FeedViewType } from "~/lib/enum"
import { getNewIssueUrl } from "~/lib/issues"
import { LanguageMap } from "~/lib/translate"
import { cn } from "~/lib/utils"
import type { ActiveEntryId, FeedModel, InboxModel } from "~/models"
import {
  useIsSoFWrappedElement,
  useWrappedElement,
  WrappedElementProvider,
} from "~/providers/wrapped-element-provider"
import { Queries } from "~/queries"
import { useEntry } from "~/store/entry"
import { useFeedById } from "~/store/feed"

import { LoadingWithIcon } from "../../components/ui/loading"
import { EntryPlaceholderDaily } from "../ai/ai-daily/EntryPlaceholderDaily"
import { EntryContentHTMLRenderer } from "../renderer/html"
import {
  getTranslationCache,
  setEntryContentScrollToTop,
  setEntryTitleMeta,
  setTranslationCache,
} from "./atoms"
import { EntryPlaceholderLogo } from "./components/EntryPlaceholderLogo"
import { EntryTitle } from "./components/EntryTitle"
import { SourceContentPanel } from "./components/SourceContentView"
import { SupportCreator } from "./components/SupportCreator"
import { EntryHeader } from "./header"
import { EntryContentLoading } from "./loading"

export interface EntryContentClassNames {
  header?: string
}
export const EntryContent = ({
  entryId,
  noMedia,
  compact,
  classNames,
}: {
  entryId: ActiveEntryId
  noMedia?: boolean
  compact?: boolean
  classNames?: EntryContentClassNames
}) => {
  const { feedId, view } = useRouteParams()
  const enableEntryWideMode = useUISettingKey("wideMode")

  if (!entryId) {
    if (enableEntryWideMode) {
      return null
    }
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

  return (
    <EntryContentRender
      entryId={entryId}
      noMedia={noMedia}
      compact={compact}
      classNames={classNames}
    />
  )
}

export const EntryContentRender: Component<{
  entryId: string
  noMedia?: boolean
  compact?: boolean
  classNames?: EntryContentClassNames
}> = ({ entryId, noMedia, className, compact, classNames }) => {
  const { t } = useTranslation()

  const entry = useEntry(entryId)
  useTitle(entry?.entries.title)

  const feed = useFeedById(entry?.feedId) as FeedModel | InboxModel
  const readerRenderInlineStyle = useUISettingKey("readerRenderInlineStyle")

  const { error, data, isPending } = useAuthQuery(
    feed?.type === "inbox" ? Queries.entries.byInboxId(entryId) : Queries.entries.byId(entryId),
    {
      staleTime: 300_000,
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

  const contentAccessories = useMemo(
    () => (isPeekModal ? undefined : <ContainerToc key={entryId} />),
    [entryId, isPeekModal],
  )
  const stableRenderStyle = useMemo(
    () =>
      readerFontFamily
        ? {
            fontFamily: readerFontFamily,
          }
        : undefined,
    [readerFontFamily],
  )
  const mediaInfo = useMemo(
    () =>
      Object.fromEntries(
        (entry?.entries.media ?? data?.entries.media)
          ?.filter((m) => m.type === "photo")
          .map((cur) => [
            cur.url,
            {
              width: cur.width,
              height: cur.height,
            },
          ]) ?? [],
      ),
    [entry?.entries.media, data?.entries.media],
  )

  if (!entry) return null

  const content = entry?.entries.content ?? data?.entries.content

  const translate = async (html: HTMLElement | null) => {
    if (!html || !entry || !entry.settings?.translation) return

    const fullText = html.textContent ?? ""
    if (!fullText) return

    const { franc } = await import("franc-min")
    const sourceLanguage = franc(fullText)
    if (sourceLanguage === LanguageMap[entry.settings?.translation].code) {
      return
    }

    const { immersiveTranslate } = await import("~/lib/immersive-translate")
    immersiveTranslate({
      html,
      entry,
      cache: {
        get: (key: string) => getTranslationCache()[key],
        set: (key: string, value: string) =>
          setTranslationCache({ ...getTranslationCache(), [key]: value }),
      },
    })
  }

  const isInbox = feed?.type === "inbox"

  return (
    <>
      <EntryHeader
        entryId={entry.entries.id}
        view={0}
        className={cn("h-[55px] shrink-0 px-3 @container", classNames?.header)}
        compact={compact}
      />

      <div className="relative flex size-full flex-col overflow-hidden">
        <ScrollArea.ScrollArea
          mask={false}
          rootClassName={cn("h-0 min-w-0 grow overflow-y-auto @container", className)}
          scrollbarClassName="mr-[1.5px]"
          viewportClassName="p-5"
          ref={scrollerRef}
        >
          <div
            style={stableRenderStyle}
            className="duration-200 ease-in-out animate-in fade-in slide-in-from-bottom-24 f-motion-reduce:fade-in-0 f-motion-reduce:slide-in-from-bottom-0"
            key={entry.entries.id}
          >
            <article
              data-testid="entry-render"
              onContextMenu={stopPropagation}
              className="relative m-auto min-w-0 max-w-[550px] @3xl:max-w-[70ch] @7xl:max-w-[80ch]"
            >
              <EntryTitle entryId={entryId} compact={compact} />

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
                      <ShadowDOM injectHostStyles={!isInbox}>
                        <EntryContentHTMLRenderer
                          view={view}
                          feedId={feed?.id}
                          entryId={entryId}
                          handleTranslate={translate}
                          mediaInfo={mediaInfo}
                          noMedia={noMedia}
                          accessory={contentAccessories}
                          as="article"
                          className="prose !max-w-full dark:prose-invert prose-h1:text-[1.6em] prose-h1:font-bold"
                          style={stableRenderStyle}
                          renderInlineStyle={readerRenderInlineStyle}
                        >
                          {content}
                        </EntryContentHTMLRenderer>
                      </ShadowDOM>
                    ) : (
                      <ReadabilityContent entryId={entryId} feedId={feed.id} />
                    )}
                  </ErrorBoundary>
                </div>
              </WrappedElementProvider>

              {entry.settings?.readability && IN_ELECTRON && (
                <ReadabilityAutoToggleEffect id={entry.entries.id} url={entry.entries.url ?? ""} />
              )}
              {entry.settings?.sourceContent && <ViewSourceContentAutoToggleEffect />}

              {!content && (
                <div className="center mt-16 min-w-0">
                  {isPending ? (
                    <EntryContentLoading icon={!isInbox ? feed?.siteUrl! : undefined} />
                  ) : error ? (
                    <div className="center flex min-w-0 flex-col gap-2">
                      <i className="i-mgc-close-cute-re text-3xl text-red-500" />
                      <span className="font-sans text-sm">Network Error</span>

                      <pre className="mt-6 w-full overflow-auto whitespace-pre-wrap break-all">
                        {error.message}
                      </pre>
                    </div>
                  ) : (
                    <NoContent
                      id={entry.entries.id}
                      url={entry.entries.url ?? ""}
                      sourceContent={entry.settings?.sourceContent}
                    />
                  )}
                </div>
              )}

              <SupportCreator entryId={entryId} />
            </article>
          </div>
        </ScrollArea.ScrollArea>
        <SourceContentPanel src={entry.entries.url} />
      </div>
    </>
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

const ReadabilityContent = ({ entryId, feedId }: { entryId: string; feedId: string }) => {
  const { t } = useTranslation()
  const result = useEntryReadabilityContent(entryId)
  const view = useRouteParamsSelector((route) => route.view)

  return (
    <div className="grow">
      {result ? (
        <p className="mb-4 rounded-xl border p-3 text-sm opacity-80">
          <i className="i-mgc-information-cute-re mr-1 translate-y-[2px]" />
          {t("entry_content.readability_notice")}
        </p>
      ) : (
        <div className="center mt-16 flex flex-col gap-2">
          <LoadingWithIcon size="large" icon={<i className="i-mgc-docment-cute-re" />} />
          <span className="text-sm">{t("entry_content.fetching_content")}</span>
        </div>
      )}

      <EntryContentHTMLRenderer
        view={view}
        feedId={feedId}
        entryId={entryId}
        as="article"
        className="prose dark:prose-invert prose-h1:text-[1.6em] prose-h1:font-bold"
      >
        {result?.content ?? ""}
      </EntryContentHTMLRenderer>
    </div>
  )
}

const NoContent: FC<{
  id: string
  url: string
  sourceContent?: boolean
}> = ({ id, url, sourceContent }) => {
  const status = useEntryInReadabilityStatus(id)
  const { t } = useTranslation("app")

  if (status !== ReadabilityStatus.INITIAL && status !== ReadabilityStatus.FAILURE) {
    return null
  }
  return (
    <div className="center">
      <div className="space-y-2 text-balance text-center text-sm text-zinc-400">
        {(isWebBuild || status === ReadabilityStatus.FAILURE) && (
          <span>{t("entry_content.no_content")}</span>
        )}
        {isWebBuild && (
          <div>
            <span>{t("entry_content.web_app_notice")}</span>
          </div>
        )}
        {!sourceContent && url && IN_ELECTRON && <ReadabilityAutoToggleEffect url={url} id={id} />}
      </div>
    </div>
  )
}

const ViewSourceContentAutoToggleEffect = () => {
  const onceRef = useRef(false)

  useEffect(() => {
    if (!onceRef.current) {
      onceRef.current = true
      enableShowSourceContent()
    }
  }, [])

  return null
}

const ReadabilityAutoToggleEffect = ({ url, id }: { url: string; id: string }) => {
  const toggle = useEntryReadabilityToggle({
    id,
    url,
  })
  const onceRef = useRef(false)

  useEffect(() => {
    if (!onceRef.current) {
      onceRef.current = true
      setReadabilityStatus({
        [id]: ReadabilityStatus.INITIAL,
      })
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

const ContainerToc: FC = memo(() => {
  const wrappedElement = useWrappedElement()
  return (
    <RootPortal to={wrappedElement!}>
      <div className="group absolute right-[-130px] top-0 h-full w-[100px]">
        <div className="sticky top-0">
          <Toc
            className={cn(
              "flex flex-col items-end animate-in fade-in-0 slide-in-from-bottom-12 easing-spring spring-soft",
              "max-h-[calc(100vh-100px)] overflow-auto scrollbar-none",

              "@[700px]:-translate-x-12 @[800px]:-translate-x-16 @[900px]:translate-x-0 @[900px]:items-start",
            )}
          />
        </div>
      </div>
    </RootPortal>
  )
})
