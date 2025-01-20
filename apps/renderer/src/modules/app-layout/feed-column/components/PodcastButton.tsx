import { PresentSheet } from "@follow/components/ui/sheet/Sheet.js"
import type { FeedModel } from "@follow/models"
import { cn } from "@follow/utils/utils"
import { useState } from "react"
import Marquee from "react-fast-marquee"

import { AudioPlayer, useAudioPlayerAtomSelector } from "~/atoms/player"
import { RelativeTime } from "~/components/ui/datetime"
import { FeedIcon } from "~/modules/feed/feed-icon"
import { PlayerProgress } from "~/modules/player/corner-player"
import { useEntry } from "~/store/entry"

const handleClickPlay = () => {
  AudioPlayer.togglePlayAndPause()
}

export const PodcastButton = ({ feed }: { feed: FeedModel }) => {
  const entryId = useAudioPlayerAtomSelector((v) => v.entryId)
  const status = useAudioPlayerAtomSelector((v) => v.status)
  const isMute = useAudioPlayerAtomSelector((v) => v.isMute)
  const playerValue = { entryId, status, isMute }

  const entry = useEntry(playerValue.entryId)

  if (!entry || !feed) return null

  return (
    <PresentSheet
      zIndex={99}
      content={
        <>
          <div className="mb-6 flex gap-4">
            <FeedIcon feed={feed} entry={entry.entries} size={58} fallback={false} noMargin />
            <div className="flex flex-col justify-center">
              <Marquee
                play={playerValue.status === "playing"}
                className="mask-horizontal font-medium"
                speed={30}
              >
                {entry.entries.title}
              </Marquee>
              <div className="mt-0.5 overflow-hidden truncate text-xs text-muted-foreground">
                <span>{feed.title}</span>
                <span> · </span>
                <span>
                  {!!entry.entries.publishedAt && <RelativeTime date={entry.entries.publishedAt} />}
                </span>
              </div>
            </div>
          </div>

          <PlayerProgress />

          <div className="mt-2 flex items-center justify-center gap-2">
            <div className="w-10">
              <PlaybackRateButton />
            </div>
            <div className="flex flex-1 justify-center gap-4">
              <ActionIcon className="i-mgc-back-2-cute-re" onClick={() => AudioPlayer.back(10)} />

              <ActionIcon
                className={cn("size-6", {
                  "i-mgc-pause-cute-fi": playerValue.status === "playing",
                  "i-mgc-loading-3-cute-re animate-spin": playerValue.status === "loading",
                  "i-mgc-play-cute-fi": playerValue.status === "paused",
                })}
                onClick={handleClickPlay}
              />

              <ActionIcon
                className="i-mgc-forward-2-cute-re"
                onClick={() => AudioPlayer.forward(10)}
              />
            </div>
            <div className="w-10">
              <ActionIcon
                className="i-mgc-close-cute-re"
                onClick={() => {
                  AudioPlayer.close()
                }}
              />
            </div>
          </div>
        </>
      }
    >
      <div className="flex size-5 items-center justify-center">
        <FeedIcon feed={feed} size={22} noMargin />
      </div>
    </PresentSheet>
  )
}

const ActionIcon = ({ className, onClick }: { className?: string; onClick?: () => void }) => (
  <button
    type="button"
    className="center size-10 rounded-full text-muted-foreground"
    onClick={onClick}
  >
    <i className={className} />
  </button>
)

const PlaybackRateButton = () => {
  const playbackRate = useAudioPlayerAtomSelector((v) => v.playbackRate)
  const rates = [0.5, 0.75, 1, 1.25, 1.5, 2]
  const [currentIndex, setCurrentIndex] = useState(playbackRate ? rates.indexOf(playbackRate) : 2)

  const handleClick = () => {
    const nextIndex = (currentIndex + 1) % rates.length
    setCurrentIndex(nextIndex)
    AudioPlayer.setPlaybackRate(rates[nextIndex]!)
  }

  return (
    <button onClick={handleClick}>
      <span className="block font-mono text-xs text-muted-foreground">
        {rates[currentIndex]!.toFixed(2)}x
      </span>
    </button>
  )
}
