import { Player } from "@renderer/atoms/player"
import { nextFrame } from "@renderer/lib/dom"
import { useEntryContentContext } from "@renderer/modules/entry-content/hooks"

import { timeStringToSeconds } from "../utils"

export const TimeStamp = (props: { time: string }) => {
  const { entryId, audioSrc: src } = useEntryContentContext()

  if (!src) return <span>{props.time}</span>
  return (
    <span
      className="dark:text-accent-500 cursor-pointer tabular-nums text-accent"
      onClick={() => {
        Player.mount({
          type: "audio",
          entryId,
          src,
          currentTime: 0,
        })
        nextFrame(() => Player.seek(timeStringToSeconds(props.time) || 0))
      }}
    >
      {props.time}
    </span>
  )
}
