import { Player } from "@renderer/atoms/player"
import { m } from "@renderer/components/common/Motion"
import { Media } from "@renderer/components/ui/media"
import type { ModalContentComponent } from "@renderer/components/ui/modal"
import { useModalStack } from "@renderer/components/ui/modal"
import { NoopChildren } from "@renderer/components/ui/modal/stacked/utils"
import { useRouteParamsSelector } from "@renderer/hooks/biz/useRouteParams"
import { urlToIframe } from "@renderer/lib/url-to-iframe"
import { cn } from "@renderer/lib/utils"
import { GridItem } from "@renderer/modules/entry-column/grid-item-template"
import { useEntry } from "@renderer/store/entry/hooks"
import { useHover } from "@use-gesture/react"
import { useEffect, useMemo, useRef, useState } from "react"

import { ReactVirtuosoItemPlaceholder } from "../../components/ui/placeholder"
import type { UniversalItemProps } from "./types"

const ViewTag = window.electron ? "webview" : "iframe"

export function VideoItem({
  entryId,
  entryPreview,
  translation,
}: UniversalItemProps) {
  const entry = useEntry(entryId) || entryPreview

  const isActive = useRouteParamsSelector(
    ({ entryId }) => entryId === entry?.entries.id,
  )

  const [miniIframeSrc, iframeSrc] = useMemo(
    () => [
      urlToIframe(entry?.entries.url, true),
      urlToIframe(entry?.entries.url),
    ],
    [entry?.entries.url],
  )
  const modalStack = useModalStack()

  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  useHover(
    (event) => {
      setHovered(event.active)
    },
    {
      target: ref,
    },
  )

  const [showPreview, setShowPreview] = useState(false)
  useEffect(() => {
    if (hovered) {
      const timer = setTimeout(() => {
        setShowPreview(true)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setShowPreview(false)
      return () => {}
    }
  }, [hovered])

  if (!entry) return <ReactVirtuosoItemPlaceholder />
  return (
    <GridItem
      entryId={entryId}
      entryPreview={entryPreview}
      translation={translation}
    >
      <div
        className="w-full"
        onClick={(e) => {
          if (iframeSrc) {
            e.stopPropagation()
            modalStack.present({
              title: "",
              content: (props) => (
                <PreviewVideoModalContent src={iframeSrc} {...props} />
              ),
              clickOutsideToDismiss: true,
              CustomModalComponent: NoopChildren,
              overlay: true,
            })
          }
        }}
      >
        <div className="overflow-x-auto" ref={ref}>
          {miniIframeSrc && showPreview ? (
            <ViewTag
              src={miniIframeSrc}
              className={cn(
                "pointer-events-none aspect-video w-full shrink-0 rounded-md bg-black object-cover",
                isActive && "rounded-b-none",
              )}
            />
          ) : entry.entries.media ?
              (
                <Media
                  key={entry.entries.media?.[0].url}
                  src={entry.entries.media?.[0].url}
                  type={entry.entries.media?.[0].type}
                  previewImageUrl={entry.entries.media?.[0].preview_image_url}
                  className={cn(
                    "aspect-video w-full shrink-0 rounded-md object-cover",
                    isActive && "rounded-b-none",
                  )}
                  loading="lazy"
                  proxy={{
                    width: 640,
                    height: 360,
                  }}
                  disableContextMenu
                />
              ) :
              (
                <div className="center aspect-video w-full flex-col gap-1 bg-muted text-xs text-muted-foreground">
                  <i className="i-mgc-sad-cute-re size-6" />
                  No video available
                </div>
              )}
        </div>
      </div>
    </GridItem>
  )
}

const PreviewVideoModalContent: ModalContentComponent<{
  src: string
}> = ({ dismiss, src }) => {
  const currentAudioPlayerIsPlay = useRef(Player.get().status === "playing")
  useEffect(() => {
    const currentValue = currentAudioPlayerIsPlay.current
    if (currentValue) {
      Player.pause()
    }
    return () => {
      if (currentValue) {
        Player.play()
      }
    }
  }, [])
  return (
    <m.div
      exit={{ scale: 0.94, opacity: 0 }}
      className="size-full p-12"
      onClick={() => dismiss()}
    >
      <ViewTag src={src} className="size-full" />
    </m.div>
  )
}

export const VideoItemSkeleton = (
  <div className="relative mx-auto w-full max-w-lg rounded-md bg-theme-background text-zinc-700 transition-colors dark:text-neutral-400">
    <div className="relative z-[1]">
      <div className="p-1.5">
        <div className="w-full">
          <div className="overflow-x-auto">
            <div className="aspect-video w-full shrink-0 overflow-hidden rounded-md bg-gray-200 dark:bg-neutral-800" />
          </div>
        </div>
        <div className="relative flex-1 px-2 pb-3 pt-1 text-sm">
          <div className="relative mb-1 mt-1.5 truncate font-medium leading-none">
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-neutral-800" />
          </div>
          <div className="mt-1 flex items-center gap-1 truncate text-[13px]">
            <div className="mr-0.5 size-4 rounded-sm bg-gray-200 dark:bg-neutral-800" />
            <div className="h-3 w-1/2 bg-gray-200 dark:bg-neutral-800" />
            <span className="text-zinc-500">·</span>
            <div className="h-3 w-12 bg-gray-200 dark:bg-neutral-800" />
          </div>
        </div>
      </div>
    </div>
  </div>
)
