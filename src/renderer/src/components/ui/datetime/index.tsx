import dayjs from "dayjs"
import type { FC } from "react"
import { useEffect, useState } from "react"

import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from "../tooltip"

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
export const RelativeTime: FC<{
  date: string | Date
  displayAbsoluteTimeAfterDay?: number
}> = (props) => {
  const { displayAbsoluteTimeAfterDay = 29 } = props
  const [relative, setRelative] = useState<string>(
    formatTime(props.date, displayAbsoluteTimeAfterDay),
  )

  useEffect(() => {
    setRelative(formatTime(props.date, displayAbsoluteTimeAfterDay))
    let timer: any = setInterval(() => {
      setRelative(formatTime(props.date, displayAbsoluteTimeAfterDay))
    }, 1000)

    return () => {
      timer = clearInterval(timer)
    }
  }, [props.date, displayAbsoluteTimeAfterDay])

  return (
    <Tooltip>
      <TooltipTrigger>{relative}</TooltipTrigger>

      <TooltipPortal>
        <TooltipContent>{dayjs(props.date).format("llll")}</TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}
