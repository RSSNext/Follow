import { useEffect, useRef } from "react"

const titleTemplate = window.electron ? `%s` : `%s | ${APP_NAME}`

export const useTitle = (title?: Nullable<string>) => {
  const currentTitleRef = useRef(document.title)
  useEffect(() => {
    if (!title) return

    document.title = titleTemplate.replace("%s", title)
    return () => {
      document.title = currentTitleRef.current
    }
  }, [title])
}
