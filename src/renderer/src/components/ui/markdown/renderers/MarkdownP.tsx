/* eslint-disable regexp/no-unused-capturing-group */
import { Player } from "@renderer/atoms/player"
import { nextFrame } from "@renderer/lib/dom"
import { useEntryContentContext } from "@renderer/modules/entry-content/provider"
import * as React from "react"

export const MarkdownP: Component<
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  > & {
    parseTimeline?: boolean
  }
> = ({ children, parseTimeline, ...props }) => {
  if (parseTimeline && typeof children === "string") {
    const renderer = ensureAndRenderTimeStamp(children)
    if (renderer) return <p>{renderer}</p>
  }

  if (parseTimeline && Array.isArray(children)) {
    return (
      <p>
        {children.map((child) => {
          if (typeof child === "string") {
            const renderer = ensureAndRenderTimeStamp(child)
            if (renderer) return renderer
          }
          return child
        })}
      </p>
    )
  }

  return <p {...props}>{children}</p>
}

const ensureAndRenderTimeStamp = (children: string) => {
  const firstPart = children.replace(" ", " ").split(" ")[0]
  // 00:00 , 00:00:00
  if (!firstPart) {
    return
  }
  const isTime = isValidTimeString(firstPart.trim())
  if (isTime) {
    return (
      <>
        <TimeStamp time={firstPart} />
        <span>{children.slice(firstPart.length)}</span>
      </>
    )
  }
  return false
}

const TimeStamp = (props: { time: string }) => {
  const { entryId, audioSrc: src } = useEntryContentContext()

  if (!src) return <span>{props.time}</span>
  return (
    <span
      className="cursor-pointer tabular-nums text-theme-accent dark:text-theme-accent-500"
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

function isValidTimeString(time: string): boolean {
  const timeRegex = /^(\d{1,2}):([0-5]\d)(:[0-5]\d)?$/
  return timeRegex.test(time)
}

function timeStringToSeconds(time: string): number | null {
  const timeParts = time.split(":").map(Number)

  if (timeParts.length === 2) {
    const [minutes, seconds] = timeParts
    return minutes * 60 + seconds
  } else if (timeParts.length === 3) {
    const [hours, minutes, seconds] = timeParts
    return hours * 3600 + minutes * 60 + seconds
  } else {
    return null
  }
}
