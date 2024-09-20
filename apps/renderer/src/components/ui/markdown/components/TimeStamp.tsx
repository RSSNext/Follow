import { AudioPlayer } from "~/atoms/player"
import { nextFrame } from "~/lib/dom"
import { useEntryContentContext } from "~/modules/entry-content/hooks"
import { useEntry } from "~/store/entry"

import { timeStringToSeconds } from "../utils"

export const TimeStamp = (props: { time: string }) => {
  const { entryId, audioSrc: src } = useEntryContentContext()

  const entry = useEntry(entryId)
  const mediaDuration = entry?.entries.attachments?.[0]?.duration_in_seconds

  if (!src) return <span>{props.time}</span>

  const seekTo = timeStringToSeconds(props.time)
  if (typeof seekTo !== "number") return <span>{props.time}</span>

  return (
    <span
      className="inline-flex cursor-pointer items-center tabular-nums text-accent dark:text-theme-accent-500"
      onClick={() => {
        AudioPlayer.mount({
          type: "audio",
          entryId,
          src,
          currentTime: 0,
        })
        nextFrame(() => AudioPlayer.seek(seekTo))
      }}
    >
      {/* <i className="i-mgc-time-cute-re mr-1 translate-y-0.5" /> */}
      {!!mediaDuration && (
        <CircleProgress
          className="mr-1 scale-95"
          percent={(seekTo / mediaDuration) * 100}
          size={16}
          strokeWidth={2}
        />
      )}
      {props.time}
    </span>
  )
}

interface CircleProgressProps {
  percent: number
  size?: number
  strokeWidth?: number
  strokeColor?: string
  backgroundColor?: string
  className?: string
}

const CircleProgress: React.FC<CircleProgressProps> = ({
  percent,
  size = 100,
  strokeWidth = 8,
  strokeColor = "hsl(var(--fo-a))",
  backgroundColor = "hsl(var(--fo-inactive))",
  className,
}) => {
  const normalizedPercent = Math.min(100, Math.max(0, percent))
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (normalizedPercent / 100) * circumference

  return (
    <svg width={size} height={size} className={className}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={backgroundColor}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.3s" }}
      />
    </svg>
  )
}
