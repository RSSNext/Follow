import { AudioPlayer } from "~/atoms/player"
import { nextFrame } from "~/lib/dom"
import { useEntryContentContext } from "~/modules/entry-content/hooks"

import { timeStringToSeconds } from "../utils"

export const TimeStamp = (props: { time: string }) => {
  const { entryId, audioSrc: src } = useEntryContentContext()

  if (!src) return <span>{props.time}</span>
  return (
    <span
      className="cursor-pointer tabular-nums text-accent dark:text-theme-accent-500"
      onClick={() => {
        AudioPlayer.mount({
          type: "audio",
          entryId,
          src,
          currentTime: 0,
        })
        nextFrame(() => AudioPlayer.seek(timeStringToSeconds(props.time) || 0))
      }}
    >
      <i className="i-mgc-time-cute-re mr-1 translate-y-0.5" />
      {props.time}
    </span>
  )
}
