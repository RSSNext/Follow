import * as Slider from "@radix-ui/react-slider"
import type { TooltipContentProps } from "@radix-ui/react-tooltip"
import dayjs from "dayjs"
import { AnimatePresence, m } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import Marquee from "react-fast-marquee"
import { useHotkeys } from "react-hotkeys-hook"
import { useTranslation } from "react-i18next"

import {
  AudioPlayer,
  getAudioPlayerAtomValue,
  useAudioPlayerAtomSelector,
  useAudioPlayerAtomValue,
} from "~/atoms/player"
import { FeedIcon } from "~/components/feed-icon"
import { microReboundPreset } from "~/components/ui/constants/spring"
import { VolumeSlider } from "~/components/ui/media/VolumeSlider"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip"
import { HotKeyScopeMap } from "~/constants"
import type { NavigateEntryOptions } from "~/hooks/biz/useNavigateEntry"
import { useNavigateEntry } from "~/hooks/biz/useNavigateEntry"
import { FeedViewType } from "~/lib/enum"
import { cn } from "~/lib/utils"
import { useEntry } from "~/store/entry"
import { useFeedById } from "~/store/feed"
import { useListById } from "~/store/list"

const handleClickPlay = () => {
  AudioPlayer.togglePlayAndPause()
}

const setNowPlaying = (metadata: MediaMetadataInit) => {
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata(metadata)
  }
}

export const CornerPlayer = () => {
  const show = useAudioPlayerAtomSelector((v) => v.show)
  const entryId = useAudioPlayerAtomSelector((v) => v.entryId)
  const entry = useEntry(entryId)
  const feed = useFeedById(entry?.feedId)

  return (
    <AnimatePresence>
      {show && entry && feed && (
        <m.div
          key="corner-player"
          className="group relative z-10 !my-0 w-full pr-px"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ ...microReboundPreset, duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <CornerPlayerImpl />
        </m.div>
      )}
    </AnimatePresence>
  )
}

const usePlayerTracker = () => {
  const playerOpenAt = useState(Date.now)[0]
  const show = useAudioPlayerAtomSelector((v) => v.show)

  useEffect(() => {
    const handler = () => {
      const playerState = getAudioPlayerAtomValue()
      window.posthog?.capture(
        "player_open_duration",
        {
          duration: Date.now() - playerOpenAt,
          status: playerState.status,
          trigger: "beforeunload",
        },
        { transport: "sendBeacon" },
      )
    }

    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [])

  useEffect(() => {
    if (!show) {
      const playerState = getAudioPlayerAtomValue()
      window.posthog?.capture("player_open_duration", {
        duration: Date.now() - playerOpenAt,
        status: playerState.status,
        trigger: "manual",
      })
    }
  }, [show])
}
const CornerPlayerImpl = () => {
  const { t } = useTranslation()
  const entryId = useAudioPlayerAtomSelector((v) => v.entryId)
  const status = useAudioPlayerAtomSelector((v) => v.status)
  const isMute = useAudioPlayerAtomSelector((v) => v.isMute)
  const listId = useAudioPlayerAtomSelector((v) => v.listId)

  const playerValue = { entryId, status, isMute }

  const entry = useEntry(playerValue.entryId)
  const feed = useFeedById(entry?.feedId)
  const list = useListById(listId)

  useHotkeys("space", handleClickPlay, {
    preventDefault: true,
    scopes: HotKeyScopeMap.Home,
  })

  useEffect(() => {
    setNowPlaying({
      title: entry?.entries.title || undefined,
      artist: feed?.title || undefined,
      album: feed?.image || undefined,
      artwork: [{ src: entry?.entries.authorAvatar || feed?.image || "" }],
    })
  }, [entry, feed])

  const navigateToEntry = useNavigateEntry()
  usePlayerTracker()

  const navigateOptions = useMemo<NavigateEntryOptions | null>(() => {
    if (!entry) return null
    const options: NavigateEntryOptions = {
      entryId: entry.entries.id,
    }
    if (feed?.type === "inbox") {
      Object.assign(options, {
        inboxId: feed.id,
        view: FeedViewType.Articles,
      })
    } else if (list) {
      Object.assign(options, {
        listId: list.id,
        view: list.view,
      })
    } else if (feed) {
      Object.assign(options, {
        feedId: feed.id,
        view: entry.view ?? FeedViewType.Audios,
      })
    } else {
      return null
    }
    return options
  }, [entry, feed, list])
  if (!entry || !feed) return null

  return (
    <>
      <div className="relative flex border-y bg-white transition-all duration-200 ease-in-out dark:bg-neutral-800">
        {/* play cover */}
        <div className="relative h-full shrink-0">
          <FeedIcon
            feed={feed}
            entry={entry.entries}
            size={58}
            fallback={false}
            className="m-0 size-[3.625rem] rounded-none"
          />
          <div className="center absolute inset-0 w-full opacity-0 transition-all duration-200 ease-in-out group-hover:opacity-100">
            <button
              type="button"
              className="center size-10 rounded-full bg-theme-background opacity-95 hover:bg-accent hover:text-white hover:opacity-100"
              onClick={handleClickPlay}
            >
              <i
                className={cn("size-6", {
                  "i-mgc-pause-cute-fi": playerValue.status === "playing",
                  "i-mgc-loading-3-cute-re animate-spin": playerValue.status === "loading",
                  "i-mgc-play-cute-fi": playerValue.status === "paused",
                })}
              />
            </button>
          </div>
        </div>

        <div className="relative truncate px-2 py-1 text-center text-sm">
          <Marquee
            play={playerValue.status === "playing"}
            className="mask-horizontal font-medium"
            speed={30}
          >
            {entry.entries.title}
          </Marquee>
          <div className="mt-0.5 overflow-hidden truncate text-xs text-muted-foreground group-hover:opacity-0">
            {feed.title}
          </div>

          {/* progress control */}
          <PlayerProgress />
        </div>
      </div>

      {/* advanced controls */}
      <div className="absolute inset-x-0 top-0 z-[-1] flex justify-between border-t bg-theme-modal-background-opaque p-1 opacity-100 transition-all duration-200 ease-in-out group-hover:-translate-y-full group-hover:opacity-100">
        <div className="flex items-center">
          <ActionIcon
            className="i-mgc-close-cute-re"
            onClick={() => AudioPlayer.close()}
            label={t("player.close")}
          />
          <ActionIcon
            className="i-mgc-external-link-cute-re"
            onClick={() => {
              if (navigateOptions) {
                navigateToEntry(navigateOptions)
              }
            }}
            label={t("player.open_entry")}
          />
          <ActionIcon
            label={t("player.download")}
            onClick={() => {
              window.open(AudioPlayer.get().src, "_blank")
            }}
          >
            <i className="i-mgc-download-2-cute-re" />
          </ActionIcon>
        </div>
        {/* audio control */}
        <div className="flex items-center">
          <ActionIcon label={<PlaybackRateSelector />} labelDelayDuration={0}>
            <PlaybackRateButton />
          </ActionIcon>
          <ActionIcon
            className={cn(
              playerValue.isMute ? "i-mgc-volume-off-cute-re text-red-500" : "i-mgc-volume-cute-re",
            )}
            onClick={() => AudioPlayer.toggleMute()}
            label={<CornerPlayerVolumeSlider />}
            labelDelayDuration={0}
          />
          <ActionIcon
            className="i-mgc-back-2-cute-re"
            onClick={() => AudioPlayer.back(10)}
            label={t("player.back_10s")}
          />
          <ActionIcon
            className="i-mgc-forward-2-cute-re"
            onClick={() => AudioPlayer.forward(10)}
            label={t("player.forward_10s")}
            tooltipAlign="end"
          />
        </div>
      </div>
    </>
  )
}

const ONE_HOUR_IN_SECONDS = 60 * 60
const PlayerProgress = () => {
  const playerValue = useAudioPlayerAtomValue()

  const { currentTime = 0, duration = 0 } = playerValue
  const [controlledCurrentTime, setControlledCurrentTime] = useState(currentTime)
  const [isDraggingProgress, setIsDraggingProgress] = useState(false)

  useEffect(() => {
    if (isDraggingProgress) return
    if (duration > 0 && currentTime >= duration) {
      AudioPlayer?.pause()
      AudioPlayer?.seek(duration)
      return
    }
    setControlledCurrentTime(currentTime)
  }, [currentTime, isDraggingProgress, duration])

  const getTimeIndicator = (time: number) => {
    return dayjs()
      .startOf("y")
      .second(time)
      .format(time > ONE_HOUR_IN_SECONDS ? "H:mm:ss" : "m:ss")
  }

  const currentTimeIndicator = getTimeIndicator(controlledCurrentTime)
  const remainingTimeIndicator = duration
    ? getTimeIndicator(duration - controlledCurrentTime)
    : null

  return (
    <div className="relative mt-2">
      <div className="absolute bottom-2 flex w-full items-center justify-between text-theme-disabled opacity-0 duration-150 ease-in-out group-hover:opacity-100">
        <div className="text-xs">{currentTimeIndicator}</div>
        {!!remainingTimeIndicator && <div className="text-xs">-{remainingTimeIndicator}</div>}
      </div>

      {/* slider */}
      {!!duration && (
        <Slider.Root
          className="relative flex h-1 w-full items-center transition-all duration-200 ease-in-out"
          min={0}
          max={duration}
          step={1}
          value={[controlledCurrentTime]}
          onPointerDown={() => setIsDraggingProgress(true)}
          onPointerUp={() => setIsDraggingProgress(false)}
          onValueChange={(value) => setControlledCurrentTime(value[0])}
          onValueCommit={(value) => AudioPlayer.seek(value[0])}
        >
          <Slider.Track className="relative h-1 w-full grow rounded bg-gray-200 duration-200 group-hover:bg-gray-300 dark:bg-neutral-700 group-hover:dark:bg-neutral-600">
            <Slider.Range className="absolute h-1 rounded bg-theme-accent-400 dark:bg-theme-accent-700" />
          </Slider.Track>

          {/* indicator */}
          <Slider.Thumb
            className="block h-2 w-[3px] rounded-[1px] bg-accent"
            aria-label="Progress"
          />
        </Slider.Root>
      )}
    </div>
  )
}

const ActionIcon = ({
  className,
  onClick,
  label,
  labelDelayDuration = 700,
  tooltipAlign,
  children,
}: {
  className?: string
  onClick?: () => void
  label: React.ReactNode
  labelDelayDuration?: number
  tooltipAlign?: TooltipContentProps["align"]
  children?: React.ReactNode
}) => (
  <Tooltip delayDuration={labelDelayDuration}>
    <TooltipTrigger
      className="center size-6 rounded-md text-zinc-500 hover:bg-theme-button-hover"
      onClick={onClick}
      asChild
    >
      <button type="button">{children || <i aria-hidden className={className} />}</button>
    </TooltipTrigger>
    <TooltipContent align={tooltipAlign}>{label}</TooltipContent>
  </Tooltip>
)

const CornerPlayerVolumeSlider = () => {
  const volume = useAudioPlayerAtomSelector((v) => v.volume)

  return <VolumeSlider volume={volume!} onVolumeChange={AudioPlayer.setVolume.bind(AudioPlayer)} />
}

const PlaybackRateSelector = () => {
  const playbackRate = useAudioPlayerAtomSelector((v) => v.playbackRate)

  return (
    <div className="flex flex-col items-center gap-0.5">
      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
        <button
          key={rate}
          type="button"
          className={cn(
            "center rounded-md p-1 font-mono hover:bg-theme-item-hover",
            playbackRate === rate && "bg-theme-item-hover text-black dark:text-white",
            playbackRate !== rate && "text-zinc-500",
          )}
          onClick={() => AudioPlayer.setPlaybackRate(rate)}
        >
          {rate.toFixed(2)}x
        </button>
      ))}
    </div>
  )
}

const PlaybackRateButton = () => {
  const playbackRate = useAudioPlayerAtomSelector((v) => v.playbackRate)

  const char = `${playbackRate || 1}`
  return (
    <span className={cn(char.length > 1 ? "text-[9px]" : "text-xs", "block font-mono")}>
      {char}x
    </span>
  )
}
