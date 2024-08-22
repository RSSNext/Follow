import { stopPropagation } from "@renderer/lib/dom"
import dayjs from "dayjs"
import type { FC } from "react"
import { useEffect, useRef, useState } from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "../tooltip"

const formatTime = (date: string | Date, relativeBeforeDay?: number) => {
  if (
    relativeBeforeDay &&
    Math.abs(dayjs(date).diff(new Date(), "d")) > relativeBeforeDay
  ) {
    return dayjs(date).format("lll")
  }
  return dayjs
    .duration(dayjs(date).diff(dayjs(), "minute"), "minute")
    .humanize()
}

const getUpdateInterval = (date: string | Date, relativeBeforeDay?: number) => {
  if (!relativeBeforeDay) return null
  const diffInSeconds = Math.abs(dayjs(date).diff(new Date(), "second"))
  if (diffInSeconds <= 60) {
    return 1000 // Update every second
  }
  const diffInMinutes = Math.abs(dayjs(date).diff(new Date(), "minute"))
  if (diffInMinutes <= 60) {
    return 60000 // Update every minute
  }
  const diffInHours = Math.abs(dayjs(date).diff(new Date(), "hour"))
  if (diffInHours <= 24) {
    return 3600000 // Update every hour
  }
  const diffInDays = Math.abs(dayjs(date).diff(new Date(), "day"))
  if (diffInDays <= relativeBeforeDay) {
    return 86400000 // Update every day
  }
  return null // No need to update
}

export const RelativeTime: FC<{
  date: string | Date
  displayAbsoluteTimeAfterDay?: number
}> = (props) => {
  const { displayAbsoluteTimeAfterDay = 29 } = props
  const [relative, setRelative] = useState<string>(() =>
    formatTime(props.date, displayAbsoluteTimeAfterDay),
  )

  const timerRef = useRef<any>(null)

  useEffect(() => {
    const updateRelativeTime = () => {
      setRelative(formatTime(props.date, displayAbsoluteTimeAfterDay))
      const updateInterval = getUpdateInterval(
        props.date,
        displayAbsoluteTimeAfterDay,
      )

      if (updateInterval !== null) {
        timerRef.current = setTimeout(updateRelativeTime, updateInterval)
      }
    }

    updateRelativeTime()

    return () => {
      clearTimeout(timerRef.current)
    }
  }, [props.date, displayAbsoluteTimeAfterDay])

  return (
    <Tooltip>

      {/* https://github.com/radix-ui/primitives/issues/2248#issuecomment-2147056904 */}
      <TooltipTrigger onFocusCapture={stopPropagation}>
        {relative}
      </TooltipTrigger>

      <TooltipPortal>
        <TooltipContent>{dayjs(props.date).format("llll")}</TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}

export const RelativeDay = ({ date }: { date: Date }) => {
  const formatDateString = (date: Date) => {
    const now = new Date()

    // Remove the time part for comparison
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const inputDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    )

    const diffTime = nowDate.getTime() - inputDate.getTime()
    const diffDays = diffTime / (1000 * 3600 * 24)

    if (diffDays === 0) {
      return "Today"
    } else if (diffDays === 1) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      })
    }
  }
  const timerRef = useRef<any>(null)
  const [dateString, setDateString] = useState<string>(() =>
    formatDateString(date),
  )

  useEffect(() => {
    const updateInterval = getUpdateInterval(date, 3)

    if (updateInterval !== null) {
      timerRef.current = setTimeout(() => {
        setDateString(formatDateString(date))
      }, updateInterval)
    }

    return () => {
      clearTimeout(timerRef.current)
    }
  }, [date])

  return (
    <Tooltip>
      <TooltipTrigger onFocusCapture={stopPropagation}>{dateString}</TooltipTrigger>
      <TooltipPortal>
        <TooltipContent>{dayjs(date).format("llll")}</TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}
