import { useModalStack } from "@renderer/components/ui/modal"
import { useCallback, useMemo } from "react"

import { DayOf } from "./constants"
import { FeedDailyModalContent } from "./FeedDailyModalContent"

export const useParseDailyDate = (day: DayOf) =>
  useMemo(() => {
    const dateObj = new Date()

    const nowHour = dateObj.getHours()
    let startDate: number
    let endDate: number
    let title: string

    const today8AM = dateObj.setHours(8, 0, 0, 0)
    const today8PM = dateObj.setHours(20, 0, 0, 0)
    dateObj.setDate(dateObj.getDate() - 1)
    const yesterday8AM = dateObj.setHours(8, 0, 0, 0)
    const yesterday8PM = dateObj.setHours(20, 0, 0, 0)
    dateObj.setDate(dateObj.getDate() - 1)
    const dayBeforeYesterday8PM = dateObj.setHours(20, 0, 0, 0)

    const isToday = day === DayOf.Today
    // For index 0, get the last past 8 AM or 8 PM; for index 1, get the second last past 8 AM or 8 PM.
    if (nowHour >= 20) {
      if (isToday) {
        endDate = today8PM - 1
        startDate = today8AM
        title = "Today"
      } else {
        endDate = today8AM - 1
        startDate = yesterday8PM
        title = "Last Night"
      }
    } else if (nowHour >= 8) {
      if (isToday) {
        endDate = today8AM - 1
        startDate = yesterday8PM
        title = "Last Night"
      } else {
        endDate = yesterday8PM - 1
        startDate = yesterday8AM
        title = "Yesterday"
      }
    } else {
      if (isToday) {
        endDate = yesterday8PM - 1
        startDate = yesterday8AM
        title = "Yesterday"
      } else {
        endDate = yesterday8AM - 1
        startDate = dayBeforeYesterday8PM
        title = "The Night Before Last"
      }
    }

    return { title, startDate, endDate }
  }, [day])

export const useAIDailyReportModal = () => {
  const { present } = useModalStack()

  return useCallback(() => {
    present({
      content: () => <FeedDailyModalContent />,
      title: "AI Daily Report",
      resizeable: true,
      clickOutsideToDismiss: true,

      resizeDefaultSize: { width: 660, height: 450 },
    })
  }, [present])
}
