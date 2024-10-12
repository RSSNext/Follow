import { IN_ELECTRON } from "@follow/shared/constants"
import { useHover } from "@use-gesture/react"
import { useEffect, useMemo, useRef, useState } from "react"

import { AudioPlayer } from "~/atoms/player"
import { m } from "~/components/common/Motion"
import { Media } from "~/components/ui/media"
import type { ModalContentComponent } from "~/components/ui/modal"
import { useModalStack } from "~/components/ui/modal"
import { PlainModal } from "~/components/ui/modal/stacked/custom-modal"
import { Skeleton } from "~/components/ui/skeleton"
import { useRouteParamsSelector } from "~/hooks/biz/useRouteParams"
import { urlToIframe } from "~/lib/url-to-iframe"
import { cn } from "~/lib/utils"
import { useEntry } from "~/store/entry/hooks"

import { ReactVirtuosoItemPlaceholder } from "../../../components/ui/placeholder"
import { GridItem } from "../templates/grid-item-template"
import type { UniversalItemProps } from "../types"

const ViewTag = IN_ELECTRON ? "webview" : "iframe"

export function VideoItem({ entryId, entryPreview, translation }: UniversalItemProps) {
  const entry = useEntry(entryId) || entryPreview

  const isActive = useRouteParamsSelector(({ entryId }) => entryId === entry?.entries.id)

  const [miniIframeSrc, iframeSrc] = useMemo(
    () => [urlToIframe(entry?.entries.url, true), urlToIframe(entry?.entries.url)],
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
    <GridItem entryId={entryId} entryPreview={entryPreview} translation={translation}>
      <div
        className="w-full cursor-card"
        onClick={() => {
          if (iframeSrc) {
            modalStack.present({
              title: "",
              content: (props) => <PreviewVideoModalContent src={iframeSrc} {...props} />,
              clickOutsideToDismiss: true,
              CustomModalComponent: PlainModal,
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
          ) : entry.entries.media ? (
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
              showFallback={true}
            />
          ) : (
            <div className="center aspect-video w-full flex-col gap-1 rounded-md bg-muted text-xs text-muted-foreground">
              <i className="i-mgc-sad-cute-re size-6" />
              No media available
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
  const currentAudioPlayerIsPlay = useRef(AudioPlayer.get().status === "playing")
  useEffect(() => {
    const currentValue = currentAudioPlayerIsPlay.current
    if (currentValue) {
      AudioPlayer.pause()
    }
    return () => {
      if (currentValue) {
        AudioPlayer.play()
      }
    }
  }, [])
  return (
    <m.div exit={{ scale: 0.94, opacity: 0 }} className="size-full p-12" onClick={() => dismiss()}>
      <ViewTag src={src} className="size-full" />
    </m.div>
  )
}

export const VideoItemSkeleton = (
  <div className="relative mx-auto w-full max-w-lg rounded-md bg-theme-background text-zinc-700 transition-colors dark:text-neutral-400">
    <div className="relative">
      <div className="p-1.5">
        <div className="w-full">
          <div className="overflow-x-auto">
            <Skeleton className="aspect-video w-full shrink-0 overflow-hidden" />
          </div>
        </div>
        <div className="relative flex-1 px-2 pb-3 pt-1 text-sm">
          <div className="relative mb-1 mt-1.5 truncate font-medium leading-none">
            <Skeleton className="h-4 w-3/4 " />
          </div>
          <div className="mt-1 flex items-center gap-1 truncate text-[13px]">
            <Skeleton className="mr-0.5 size-4" />
            <Skeleton className="h-3 w-1/2 " />
            <span className="text-zinc-500">·</span>
            <Skeleton className="h-3 w-12 " />
          </div>
        </div>
      </div>
    </div>
  </div>
)
