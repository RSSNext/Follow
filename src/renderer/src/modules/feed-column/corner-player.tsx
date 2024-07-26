import * as Slider from "@radix-ui/react-slider"
import { Player, usePlayerAtomValue } from "@renderer/atoms/player"
import { FeedIcon } from "@renderer/components/feed-icon"
import { softBouncePreset } from "@renderer/components/ui/constants/spring"
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip"
import { cn } from "@renderer/lib/utils"
import { useEntry } from "@renderer/store/entry"
import { useFeedById } from "@renderer/store/feed"
import dayjs from "dayjs"
import { AnimatePresence, m } from "framer-motion"
import { useEffect, useState } from "react"
import Marquee from "react-fast-marquee"

const handleClickPlay = () => {
  Player.togglePlayAndPause()
}

export const CornerPlayer = () => {
  const playerValue = usePlayerAtomValue()
  const entry = useEntry(playerValue.entryId)
  const feed = useFeedById(entry?.feedId)

  const { currentTime = 0, duration = 0 } = playerValue
  const [controlledCurrentTime, setControlledCurrentTime] = useState(currentTime)
  const [isDraggingProgress, setIsDraggingProgress] = useState(false)
  useEffect(() => {
    if (isDraggingProgress) return
    setControlledCurrentTime(currentTime)
  }, [currentTime, isDraggingProgress])

  const currentTimeIndicator = dayjs().startOf("y").second(controlledCurrentTime).format("mm:ss")
  const remainingTimeIndicator = dayjs().startOf("y").second(duration - controlledCurrentTime).format("mm:ss")

  return (
    <AnimatePresence>
      {playerValue.show && entry && feed && (
        <m.div
          className="group absolute inset-x-1 bottom-10"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ ...softBouncePreset, duration: 0.1 }}
        >
          {/* advanced controls */}
          <div className="flex translate-y-10 justify-between rounded-t-lg bg-theme-modal-background p-1 opacity-0 shadow backdrop-blur transition-all duration-200 ease-in-out group-hover:translate-y-0 group-hover:opacity-100">
            <div>
              <ActionIcon
                className="i-mingcute-close-fill"
                onClick={() => Player.close()}
                label="Close"
              />
            </div>
            <div>
              <ActionIcon
                className="i-mingcute-fast-forward-fill"
                label={<PlaybackRateSelector />}
                labelDelayDuration={0}
              />
              <ActionIcon
                className={cn(
                  playerValue.isMute ?
                    "i-mingcute-volume-mute-fill text-red-500" :
                    "i-mingcute-volume-fill",
                )}
                onClick={() => Player.toggleMute()}
                label={<VolumeSlider />}
                labelDelayDuration={0}
              />
              <ActionIcon
                className="i-mingcute-back-2-fill"
                onClick={() => Player.back(10)}
                label="Back 10s"
              />
              <ActionIcon
                className="i-mingcute-forward-2-fill"
                onClick={() => Player.forward(10)}
                label="Forward 10s"
              />
            </div>
          </div>

          <div className="flex rounded-lg bg-theme-modal-background shadow backdrop-blur transition-all duration-200 ease-in-out hover:rounded-b-lg hover:rounded-t-none">
            {/* play cover */}
            <div className="relative">
              <FeedIcon
                feed={feed}
                entry={entry.entries}
                size={50}
                className="m-0"
              />
              <div className="center absolute inset-0 w-full opacity-0 transition-all duration-200 ease-in-out group-hover:opacity-100">
                <button
                  type="button"
                  className="center size-10 rounded-full bg-theme-background opacity-95 hover:bg-theme-accent hover:opacity-100"
                  onClick={handleClickPlay}
                >
                  <i
                    className={cn("size-6", {
                      "i-mingcute-pause-fill": playerValue.status === "playing",
                      "i-mingcute-loading-fill animate-spin":
                        playerValue.status === "loading",
                      "i-mingcute-play-fill": playerValue.status === "paused",
                    })}
                  />
                </button>
              </div>
            </div>

            <div className="relative truncate text-center text-sm">
              <Marquee
                play={playerValue.status === "playing"}
                gradient
                gradientWidth={24}
                gradientColor="var(--fo-modal-background)"
                speed={30}
              >
                {entry.entries.title}
              </Marquee>
              <div className="text-xs text-muted-foreground">{feed.title}</div>

              {/* progress control */}
              <div className="relative mt-2">
                <div className="absolute bottom-1 flex w-full items-center justify-between text-theme-disabled opacity-0 duration-200 ease-in-out group-hover:opacity-100">
                  <div className="text-xs">{currentTimeIndicator}</div>
                  <div className="text-xs">
                    -
                    {remainingTimeIndicator}
                  </div>
                </div>

                {/* slider */}
                <Slider.Root
                  className="relative flex h-1 w-full items-center transition-all duration-200 ease-in-out"
                  min={0}
                  max={duration}
                  step={1}
                  value={[controlledCurrentTime]}
                  onPointerDown={() => setIsDraggingProgress(true)}
                  onPointerUp={() => setIsDraggingProgress(false)}
                  onValueChange={(value) => setControlledCurrentTime(value[0])}
                  onValueCommit={(value) => Player.seek(value[0])}
                >
                  <Slider.Track className="relative h-1 w-full grow bg-muted group-hover:bg-theme-disabled">
                    <Slider.Range className="absolute h-1 rounded-md bg-theme-accent" />
                  </Slider.Track>

                  {/* indicator */}
                  <Slider.Thumb
                    className="block h-2 w-1 rounded-sm bg-theme-accent"
                    aria-label="Progress"
                  />
                </Slider.Root>
              </div>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  )
}

const ActionIcon = ({
  className,
  onClick,
  label,
  labelDelayDuration = 700,
}: {
  className?: string
  onClick?: () => void
  label: React.ReactNode
  labelDelayDuration?: number
}) => (
  <Tooltip delayDuration={labelDelayDuration}>
    <TooltipTrigger>
      <button
        type="button"
        className="center size-6 rounded-md text-zinc-500 hover:bg-theme-item-hover"
        onClick={onClick}
      >
        <i className={className} />
      </button>
    </TooltipTrigger>
    <TooltipContent>{label}</TooltipContent>
  </Tooltip>
)

const VolumeSlider = () => {
  const playerValue = usePlayerAtomValue()

  return (
    <Slider.Root
      className="relative flex h-10 w-1 flex-col items-center p-1"
      max={1}
      step={0.01}
      orientation="vertical"
      value={[playerValue.volume ?? 0.8]}
      onValueChange={(value) => Player.setVolume(value[0])}
    >
      <Slider.Track className="relative w-1 grow bg-zinc-500">
        <Slider.Range className="absolute w-full bg-black dark:bg-white" />
      </Slider.Track>
      <Slider.Thumb
        className="block bg-black dark:bg-white"
        aria-label="Volume"
      />
    </Slider.Root>
  )
}

const PlaybackRateSelector = () => {
  const playerValue = usePlayerAtomValue()

  return (
    <div className="flex flex-col items-center">
      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
        <button
          key={rate}
          type="button"
          className={cn(
            "center rounded-md font-mono hover:bg-theme-item-hover",
            playerValue.playbackRate === rate && "bg-theme-item-hover text-black dark:text-white",
            playerValue.playbackRate !== rate && "text-zinc-500",
          )}
          onClick={() => Player.setPlaybackRate(rate)}
        >
          {rate.toFixed(2)}
          x
        </button>
      ))}

    </div>
  )
}
