import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import localizedFormat from "dayjs/plugin/localizedFormat"
import relativeTime from "dayjs/plugin/relativeTime"
// Initialize dayjs
dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
