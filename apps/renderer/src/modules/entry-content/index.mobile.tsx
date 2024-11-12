import { MemoedDangerousHTMLStyle } from "@follow/components/common/MemoedDangerousHTMLStyle.js"
import { AutoResizeHeight } from "@follow/components/ui/auto-resize-height/index.jsx"
import { useTitle } from "@follow/hooks"
import type { FeedModel, InboxModel } from "@follow/models/types"
import { clearSelection, stopPropagation } from "@follow/utils/dom"
import { cn } from "@follow/utils/utils"
import { ErrorBoundary } from "@sentry/react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { useUISettingKey } from "~/atoms/settings/ui"
import { ShadowDOM } from "~/components/common/ShadowDOM"
import { useRouteParamsSelector } from "~/hooks/biz/useRouteParams"
import { useAuthQuery } from "~/hooks/common"
import { LanguageMap } from "~/lib/translate"
import { WrappedElementProvider } from "~/providers/wrapped-element-provider"
import { Queries } from "~/queries"
import { useEntry } from "~/store/entry"
import { useFeedById } from "~/store/feed"
import { useInboxById } from "~/store/inbox"

import { EntryContentHTMLRenderer } from "../renderer/html"
import { getTranslationCache, setTranslationCache } from "./atoms"
import { EntryTitle } from "./components/EntryTitle"
import { SupportCreator } from "./components/SupportCreator"
import { EntryHeader } from "./header"
import { NoContent, RenderError, SummaryLoadingSkeleton, TitleMetaHandler } from "./index.shared"
import { EntryContentLoading } from "./loading"

export interface EntryContentClassNames {
  header?: string
}

export const EntryContent: Component<{
  entryId: string
  noMedia?: boolean
  compact?: boolean
  classNames?: EntryContentClassNames
}> = ({ entryId, noMedia, compact, classNames }) => {
  const { t } = useTranslation()

  const entry = useEntry(entryId)
  useTitle(entry?.entries.title)

  const feed = useFeedById(entry?.feedId) as FeedModel | InboxModel
  const readerRenderInlineStyle = useUISettingKey("readerRenderInlineStyle")
  const inbox = useInboxById(entry?.inboxId, (inbox) => inbox !== null)

  const { error, data, isPending } = useAuthQuery(
    inbox ? Queries.entries.byInboxId(entryId) : Queries.entries.byId(entryId),
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
  const customCSS = useUISettingKey("customCSS")

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

  const isInbox = !!inbox

  return (
    <>
      <EntryHeader
        entryId={entry.entries.id}
        view={0}
        className={cn(
          "sticky top-0 z-[12] h-[55px] shrink-0 bg-background px-3 @container",
          classNames?.header,
        )}
        compact={compact}
      />

      <div className="relative flex size-full flex-col px-4 @container print:size-auto print:overflow-visible">
        <div
          onPointerDown={clearSelection}
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
              <div className="mx-auto mb-32 mt-8 max-w-full cursor-auto select-text text-[0.94rem]">
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
                  <ShadowDOM injectHostStyles={!isInbox}>
                    {!!customCSS && (
                      <MemoedDangerousHTMLStyle>{customCSS}</MemoedDangerousHTMLStyle>
                    )}
                    <EntryContentHTMLRenderer
                      view={view}
                      feedId={feed?.id}
                      entryId={entryId}
                      handleTranslate={translate}
                      mediaInfo={mediaInfo}
                      noMedia={noMedia}
                      as="article"
                      className="prose !max-w-full dark:prose-invert prose-h1:text-[1.6em] prose-h1:font-bold"
                      style={stableRenderStyle}
                      renderInlineStyle={readerRenderInlineStyle}
                    >
                      {content}
                    </EntryContentHTMLRenderer>
                  </ShadowDOM>
                </ErrorBoundary>
              </div>
            </WrappedElementProvider>

            {!content && (
              <div className="center mt-16 min-w-0">
                {isPending ? (
                  <EntryContentLoading
                    icon={!isInbox ? (feed as FeedModel)?.siteUrl! : undefined}
                  />
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
      </div>
    </>
  )
}
