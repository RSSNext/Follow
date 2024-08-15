import { FeedIcon } from "@renderer/components/feed-icon"
import { EmptyIcon } from "@renderer/components/icons/empty"
import { AutoResizeHeight } from "@renderer/components/ui/auto-resize-height"
import { Card, CardContent } from "@renderer/components/ui/card"
import { Collapse } from "@renderer/components/ui/collapse"
import { RelativeTime } from "@renderer/components/ui/datetime"
import type { LinkProps } from "@renderer/components/ui/link"
import { LoadingCircle } from "@renderer/components/ui/loading"
import { Markdown } from "@renderer/components/ui/markdown"
import { MarkdownLink } from "@renderer/components/ui/markdown/renderers"
import { Media } from "@renderer/components/ui/media"
import { usePreviewMedia } from "@renderer/components/ui/media/hooks"
import { useModalStack } from "@renderer/components/ui/modal"
import { PeekModal } from "@renderer/components/ui/modal/inspire/PeekModal"
import { NoopChildren } from "@renderer/components/ui/modal/stacked/utils"
import { Paper } from "@renderer/components/ui/paper"
import { ScrollArea } from "@renderer/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip"
import { useAuthQuery } from "@renderer/hooks/common"
import { apiClient } from "@renderer/lib/api-fetch"
import { defineQuery } from "@renderer/lib/defineQuery"
import { nextFrame, stopPropagation } from "@renderer/lib/dom"
import { cn, isBizId } from "@renderer/lib/utils"
import { FlatMarkAllButton } from "@renderer/modules/entry-column/components/mark-all-button"
import { StarIcon } from "@renderer/modules/entry-column/star-icon"
import { EntryContentRender } from "@renderer/modules/entry-content"
import { Queries } from "@renderer/queries"
import { useEntry } from "@renderer/store/entry"
import { useFeedById } from "@renderer/store/feed"
import { m, useAnimationControls } from "framer-motion"
import type { Components } from "hast-util-to-jsx-runtime"
import { useEffect, useState } from "react"

import { useParseDailyDate } from "./hooks"
import type { DailyItemProps, DailyView } from "./types"

export const DailyItem = ({ view, day }: DailyItemProps) => {
  const { title, startDate, endDate } = useParseDailyDate(day)
  return (
    <Collapse
      hideArrow
      title={(
        <DailyReportTitle
          title={title}
          startDate={startDate}
          endDate={endDate}
        />
      )}
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
}) => (
  <div className="flex items-center justify-center gap-2 text-base">
    <i className="i-mgc-magic-2-cute-re" />
    <div className="font-medium">
      {title}
      's Top News
    </div>
    <Tooltip>
      <TooltipTrigger asChild>
        <i className="i-mgc-question-cute-re translate-y-px" />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent>
          <ul className="list-outside list-decimal text-wrap pl-6 text-left text-sm">
            <li>
              Here is news selected by AI from your timeline
              {" ("}
              {new Date(startDate).toLocaleTimeString("en-US", {
                weekday: "short",
                hour: "numeric",
                minute: "numeric",
              })}
              {" "}
              -
              {" "}
              {new Date(endDate + 1).toLocaleTimeString("en-US", {
                weekday: "short",
                hour: "numeric",
                minute: "numeric",
              })}
              {") "}
              that may be important to you.
            </li>
            <li>Update daily at 8 AM and 8 PM.</li>
          </ul>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  </div>
)

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
        <ScrollArea.ScrollArea
          mask={false}
          flex
          viewportClassName="max-h-[calc(100vh-500px)]"
        >
          <AutoResizeHeight spring>
            {content.isLoading ? (
              <LoadingCircle size="large" className="mt-8 text-center" />
            ) : (
              !!content.data && (
                <Markdown
                  components={{
                    a: RelatedEntryLink as Components["a"],
                  }}
                  className="prose-sm mt-4 px-6 prose-p:my-1 prose-ul:my-1 prose-ul:list-outside prose-ul:list-disc prose-li:marker:text-theme-accent"
                >
                  {content.data}
                </Markdown>
              )
            )}
          </AutoResizeHeight>
        </ScrollArea.ScrollArea>
        {!!content.data && (
          <FlatMarkAllButton
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
  return (
    <div className="center flex-col">
      {content.isLoading ? (
        <LoadingCircle
          size="large"
          className="center pointer-events-none absolute inset-0 mt-8 text-center"
        />
      ) : content.data ?
          (
            <Markdown
              components={{
                a: RelatedEntryLink as Components["a"],
              }}
              className="prose-sm mt-4 px-6 prose-p:my-1 prose-ul:my-1 prose-ul:list-outside prose-ul:list-disc prose-li:marker:text-theme-accent"
            >
              {content.data}
            </Markdown>
          ) :
          (
            <div className="center pointer-events-none absolute inset-0 translate-y-6 flex-col gap-4 opacity-80">
              <EmptyIcon />
              <p>No AI news found for this period.</p>
            </div>
          )}

      {!!content.data && (
        <FlatMarkAllButton
          className="ml-auto"
          filter={{
            startTime: startDate,
            endTime: endDate,
          }}
        />
      )}
    </div>
  )
}

const createRelatedEntryLink =
  (variant: "toast" | "modal") => (props: LinkProps) => {
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
              CustomModalComponent: NoopChildren,
              content: () => <EntryToastPreview entryId={entryId} />,
              overlay: false,
              modal: false,
              modalContainerClassName: "right-0 left-[auto]",
            })
          } else {
            present({
              ...basePresentProps,

              modalClassName:
                "relative mx-auto mt-[10vh] scrollbar-none max-w-full overflow-auto px-2 lg:max-w-[65rem] lg:p-0",
              // eslint-disable-next-line @eslint-react/no-nested-components
              CustomModalComponent: ({ children }) => {
                const { feedId } = useEntry(entryId) || {}
                return (
                  <PeekModal to={`/feeds/${feedId}/${entryId}`}>
                    {children}
                  </PeekModal>
                )
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

  const variants = {
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
    <>
      <m.div
        tabIndex={-1}
        initial="initial"
        animate={controller}
        onPointerDown={stopPropagation}
        onPointerDownCapture={stopPropagation}
        variants={variants}
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
    </>
  )
}

const EntryModalPreview = ({ entryId }: { entryId: string }) => (
  <Paper className="!p-0">
    <EntryContentRender className="h-auto" entryId={entryId} />
  </Paper>
)
