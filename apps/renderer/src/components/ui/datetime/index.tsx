import dayjs from "dayjs"
import type { FC } from "react"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { useGeneralSettingSelector } from "~/atoms/settings/general"
import { stopPropagation } from "~/lib/dom"

import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from "../tooltip"

const formatTemplateString = "lll"
const formatTime = (
  date: string | Date,
  relativeBeforeDay?: number,
  template = formatTemplateString,
) => {
  if (relativeBeforeDay && Math.abs(dayjs(date).diff(new Date(), "d")) > relativeBeforeDay) {
    return dayjs(date).format(template)
  }
  return dayjs.duration(dayjs(date).diff(dayjs(), "minute"), "minute").humanize()
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
  dateFormatTemplate?: string
}> = (props) => {
  const { displayAbsoluteTimeAfterDay = 29, dateFormatTemplate = formatTemplateString } = props
  const [relative, setRelative] = useState<string>(() =>
    formatTime(props.date, displayAbsoluteTimeAfterDay, dateFormatTemplate),
  )

  const timerRef = useRef<any>(null)

  useEffect(() => {
    const updateRelativeTime = () => {
      setRelative(formatTime(props.date, displayAbsoluteTimeAfterDay, dateFormatTemplate))
      const updateInterval = getUpdateInterval(props.date, displayAbsoluteTimeAfterDay)

      if (updateInterval !== null) {
        timerRef.current = setTimeout(updateRelativeTime, updateInterval)
      }
    }

    updateRelativeTime()

    return () => {
      clearTimeout(timerRef.current)
    }
  }, [props.date, displayAbsoluteTimeAfterDay, dateFormatTemplate])
  const formated = dayjs(props.date).format(dateFormatTemplate)

  if (formated === relative) {
    return <>{relative}</>
  }
  return (
    <Tooltip>
      {/* https://github.com/radix-ui/primitives/issues/2248#issuecomment-2147056904 */}
      <TooltipTrigger onFocusCapture={stopPropagation}>{relative}</TooltipTrigger>

      <TooltipPortal>
        <TooltipContent>{formated}</TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}

export const RelativeDay = ({ date }: { date: Date }) => {
  const { t } = useTranslation("common")
  const language = useGeneralSettingSelector((s) => s.language)

  const formatDateString = (date: Date) => {
    const now = new Date()

    // Remove the time part for comparison
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

    const diffTime = nowDate.getTime() - inputDate.getTime()
    const diffDays = diffTime / (1000 * 3600 * 24)

    if (diffDays === 0) {
      return t("time.today")
    } else if (diffDays === 1) {
      return t("time.yesterday")
    } else {
      let locale: Intl.Locale

      try {
        locale = new Intl.Locale(language.replace("_", "-"))
      } catch {
        locale = new Intl.Locale("en-US")
      }
      return date.toLocaleDateString(locale, {
        weekday: "long",
        month: "short",
        day: "numeric",
      })
    }
  }
  const timerRef = useRef<any>(null)
  const [dateString, setDateString] = useState<string>(() => formatDateString(date))

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
  }, [date, language])

  const formated = dayjs(date).format(formatTemplateString)
  if (formated === dateString) {
    return <>{dateString}</>
  }
  return (
    <Tooltip>
      <TooltipTrigger onFocusCapture={stopPropagation}>{dateString}</TooltipTrigger>
      <TooltipPortal>
        <TooltipContent>{formated}</TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}
