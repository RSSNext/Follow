import { EmptyIcon } from "@follow/components/icons/empty.jsx"
import { AutoResizeHeight } from "@follow/components/ui/auto-resize-height/index.jsx"
import { Card, CardContent } from "@follow/components/ui/card/index.jsx"
import { LoadingCircle } from "@follow/components/ui/loading/index.jsx"
import { ScrollArea } from "@follow/components/ui/scroll-area/index.js"
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@follow/components/ui/tooltip/index.jsx"
import { nextFrame, stopPropagation } from "@follow/utils/dom"
import { cn, isBizId } from "@follow/utils/utils"
import type { Variant } from "framer-motion"
import { m, useAnimationControls } from "framer-motion"
import type { Components } from "hast-util-to-jsx-runtime"
import { useEffect, useState } from "react"
import { Trans, useTranslation } from "react-i18next"

import { Collapse } from "~/components/ui/collapse"
import { RelativeTime } from "~/components/ui/datetime"
import type { LinkProps } from "~/components/ui/link"
import { Markdown } from "~/components/ui/markdown/Markdown"
import { MarkdownLink } from "~/components/ui/markdown/renderers"
import { Media } from "~/components/ui/media"
import { usePreviewMedia } from "~/components/ui/media/hooks"
import { useModalStack } from "~/components/ui/modal"
import { PeekModal } from "~/components/ui/modal/inspire/PeekModal"
import { PlainModal } from "~/components/ui/modal/stacked/custom-modal"
import { Paper } from "~/components/ui/paper"
import { useAuthQuery } from "~/hooks/common"
import { apiClient } from "~/lib/api-fetch"
import { defineQuery } from "~/lib/defineQuery"
import { FlatMarkAllReadButton } from "~/modules/entry-column/components/mark-all-button"
import { StarIcon } from "~/modules/entry-column/star-icon"
import { EntryContentRender } from "~/modules/entry-content"
import { FeedIcon } from "~/modules/feed/feed-icon"
import { Queries } from "~/queries"
import { useEntry } from "~/store/entry"
import { useFeedById } from "~/store/feed"

import type { DailyItemProps, DailyView } from "./types"
import { useParseDailyDate } from "./useParseDailyDate"

export const DailyItem = ({ view, day }: DailyItemProps) => {
  const { title, startDate, endDate } = useParseDailyDate(day)
  return (
    <Collapse
      hideArrow
      title={<DailyReportTitle title={title} startDate={startDate} endDate={endDate} />}
      className="mx-auto w-full max-w-lg border-b pb-6 last:border-b-0"
    >
      <DailyReportContent endDate={endDate} view={view} startDate={startDate} />
    </Collapse>
  )
}

export const DailyReportTitle = ({
  endDate,
  startDate,
  title,
}: {
  title: string
  startDate: number
  endDate: number
}) => {
  const { t } = useTranslation()
  return (
    <div className="flex items-center justify-center gap-2 text-base">
      <i className="i-mgc-magic-2-cute-re" />
      <div className="font-medium">{t("ai_daily.title", { title })}</div>
      <Tooltip>
        <TooltipTrigger asChild>
          <i className="i-mgc-question-cute-re text-sm" />
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent>
            <ul className="list-outside list-decimal text-wrap pl-6 text-left text-sm">
              <li>
                <Trans
                  i18nKey="ai_daily.tooltip.content"
                  components={{
                    From: (
                      <span>
                        {new Date(startDate).toLocaleTimeString("en-US", {
                          weekday: "short",
                          hour: "numeric",
                          minute: "numeric",
                        })}
                      </span>
                    ),
                    To: (
                      <span>
                        {new Date(endDate + 1).toLocaleTimeString("en-US", {
                          weekday: "short",
                          hour: "numeric",
                          minute: "numeric",
                        })}
                      </span>
                    ),
                  }}
                />
              </li>
              <li>{t("ai_daily.tooltip.update_schedule")}</li>
            </ul>
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </div>
  )
}

const useQueryData = ({
  endDate,
  startDate,
  view,
}: Pick<DailyReportContentProps, "view" | "startDate" | "endDate">) =>
  useAuthQuery(
    defineQuery(["daily", view, startDate, endDate], async () => {
      const res = await apiClient.ai.daily.$get({
        query: {
          startDate: `${+startDate}`,
          view: `${view}`,
        },
      })
      return res.data
    }),
    {
      meta: {
        persist: true,
      },
    },
  )

interface DailyReportContentProps {
  view: DailyView
  startDate: number
  endDate: number
}

export const DailyReportContent: Component<DailyReportContentProps> = ({
  endDate,
  startDate,

  view,
  className,
}) => {
  const content = useQueryData({ endDate, startDate, view })

  const RelatedEntryLink = useState(() => createRelatedEntryLink("modal"))[0]
  return (
    <Card className="border-none bg-transparent">
      <CardContent className={cn("space-y-0 p-0", className)}>
        <ScrollArea.ScrollArea mask={false} flex viewportClassName="max-h-[calc(100vh-500px)]">
          <AutoResizeHeight spring>
            {content.isLoading ? (
              <LoadingCircle size="large" className="mt-8 text-center" />
            ) : (
              !!content.data && (
                <Markdown
                  components={{
                    a: RelatedEntryLink as Components["a"],
                  }}
                  className="prose-sm mt-4 px-6 prose-p:my-1 prose-ul:my-1 prose-ul:list-outside prose-ul:list-disc prose-li:marker:text-accent"
                >
                  {content.data}
                </Markdown>
              )
            )}
          </AutoResizeHeight>
        </ScrollArea.ScrollArea>
        {!!content.data && (
          <FlatMarkAllReadButton
            className="ml-auto"
            filter={{
              startTime: startDate,
              endTime: endDate,
            }}
          />
        )}
      </CardContent>
    </Card>
  )
}

export const DailyReportModalContent: Component<DailyReportContentProps> = ({
  endDate,
  startDate,
  view,
}) => {
  const content = useQueryData({ endDate, startDate, view })

  const RelatedEntryLink = useState(() => createRelatedEntryLink("toast"))[0]
  const { t } = useTranslation()
  if (!content.data && !content.isLoading)
    return (
      <div className="center pointer-events-none absolute inset-0 translate-y-6 flex-col gap-4 opacity-80">
        <EmptyIcon />
        <p>{t("ai_daily.no_found")}</p>
      </div>
    )
  return (
    <div className="center grow flex-col">
      <div className="flex grow flex-col">
        {content.isLoading ? (
          <LoadingCircle
            size="large"
            className="center pointer-events-none absolute inset-0 mt-8 text-center"
          />
        ) : content.data ? (
          <Markdown
            components={{
              a: RelatedEntryLink as Components["a"],
            }}
            className="prose-sm mt-4 h-0 grow overflow-auto px-6 prose-p:my-1 prose-ul:my-1 prose-ul:list-outside prose-ul:list-disc prose-li:marker:text-accent"
          >
            {content.data}
          </Markdown>
        ) : null}
      </div>

      {!!content.data && (
        <FlatMarkAllReadButton
          className="ml-auto shrink-0"
          filter={{
            startTime: startDate,
            endTime: endDate,
          }}
        />
      )}
    </div>
  )
}

const createRelatedEntryLink = (variant: "toast" | "modal") => (props: LinkProps) => {
  const { href, children } = props
  const entryId = isBizId(href) ? href : null

  const { present } = useModalStack()

  if (!entryId) {
    return <MarkdownLink {...props} />
  }
  return (
    <button
      type="button"
      className="follow-link--underline cursor-pointer font-semibold text-foreground no-underline"
      onClick={() => {
        const basePresentProps = {
          clickOutsideToDismiss: true,
          title: "Entry Preview",
        }

        if (variant === "toast") {
          present({
            ...basePresentProps,
            CustomModalComponent: PlainModal,
            content: () => <EntryToastPreview entryId={entryId} />,
            overlay: false,
            modal: false,
            modalContainerClassName: "right-0 left-[auto]",
          })
        } else {
          present({
            ...basePresentProps,
            autoFocus: false,
            modalClassName:
              "relative mx-auto mt-[10vh] scrollbar-none max-w-full overflow-auto px-2 lg:max-w-[65rem] lg:p-0",
            // eslint-disable-next-line @eslint-react/no-nested-components
            CustomModalComponent: ({ children }) => {
              const { feedId } = useEntry(entryId) || {}
              return <PeekModal to={`/feeds/${feedId}/${entryId}`}>{children}</PeekModal>
            },
            content: () => <EntryModalPreview entryId={entryId} />,

            overlay: true,
          })
        }
      }}
    >
      {children}
      <i className="i-mgc-arrow-right-up-cute-re size-[0.9em] translate-y-[2px] opacity-70" />
    </button>
  )
}

const EntryToastPreview = ({ entryId }: { entryId: string }) => {
  useAuthQuery(Queries.entries.byId(entryId))

  const variants: Record<string, Variant> = {
    enter: {
      x: 0,
      opacity: 1,
    },
    initial: {
      x: 700,
      opacity: 0.9,
    },
    exit: {
      x: 750,
      opacity: 0,
    },
  }
  const entry = useEntry(entryId)
  const feed = useFeedById(entry?.feedId || "")
  const controller = useAnimationControls()

  const isDisplay = !!entry && !!feed
  useEffect(() => {
    if (isDisplay) {
      nextFrame(() => controller.start("enter"))
    }
  }, [controller, isDisplay])

  const previewMedia = usePreviewMedia()

  if (!isDisplay) return null

  return (
    <m.div
      tabIndex={-1}
      initial="initial"
      animate={controller}
      onPointerDown={stopPropagation}
      onPointerDownCapture={stopPropagation}
      variants={variants}
      onWheel={stopPropagation}
      transition={{
        type: "spring",
        mass: 0.4,
        tension: 120,
        friction: 1.4,
      }}
      exit="exit"
      layout="size"
      className={cn(
        "shadow-perfect relative flex flex-col items-center rounded-xl border bg-theme-background p-8",
        "mr-4 mt-4 max-h-[500px] w-[60ch] max-w-full overflow-auto",
      )}
    >
      <div className="flex w-full gap-3">
        <FeedIcon
          fallback
          className="mask-squircle mask"
          feed={feed}
          entry={entry.entries}
          size={36}
        />
        <div className="flex min-w-0 grow flex-col">
          <div className="w-[calc(100%-10rem)] space-x-1">
            <span className="font-semibold">{entry.entries.author}</span>
            <span className="text-zinc-500">·</span>
            <span className="text-zinc-500">
              <RelativeTime date={entry.entries.publishedAt} />
            </span>
          </div>
          <div
            className={cn(
              "relative mt-0.5 whitespace-pre-line text-base",
              !!entry.collections && "pr-5",
            )}
          >
            <div
              className={cn(
                "rounded-xl p-3 align-middle text-[15px]",
                "rounded-tl-none bg-zinc-600/5 dark:bg-zinc-500/20",
                "mt-1 -translate-x-3",
              )}
            >
              {entry.entries.description}

              {!!entry.entries.media?.length && (
                <div className="mt-1 flex w-full gap-2 overflow-x-auto">
                  {entry.entries.media.map((media, i, mediaList) => (
                    <Media
                      key={media.url}
                      src={media.url}
                      type={media.type}
                      previewImageUrl={media.preview_image_url}
                      className="size-28 shrink-0 cursor-zoom-in"
                      loading="lazy"
                      proxy={{
                        width: 224,
                        height: 224,
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        previewMedia(mediaList, i)
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            {!!entry.collections && <StarIcon />}
          </div>

          {/* End right column */}
        </div>
      </div>
    </m.div>
  )
}

const EntryModalPreview = ({ entryId }: { entryId: string }) => (
  <Paper className="!p-0">
    <EntryContentRender
      className="h-auto [&_#entry-action-header-bar]:!bg-transparent"
      entryId={entryId}
    />
  </Paper>
)
