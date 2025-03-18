import { useEffect, useMemo, useRef } from "react"

import { useNavigation } from "../hooks"

export const useCombinedLifecycleEvents = (
  screenId: string,
  {
    onAppear,
    onDisappear,
    onWillAppear,
    onWillDisappear,
  }: {
    onAppear?: () => void
    onDisappear?: () => void
    onWillAppear?: () => void
    onWillDisappear?: () => void
  } = {},
) => {
  const navigation = useNavigation()
  const stableRef = useRef({
    onAppear,
    onDisappear,
    onWillAppear,
    onWillDisappear,
  })

  useEffect(() => {
    stableRef.current = {
      onAppear,
      onDisappear,
      onWillAppear,
      onWillDisappear,
    }
  }, [onAppear, onDisappear, onWillAppear, onWillDisappear])
  return useMemo(() => {
    return {
      onAppear: () => {
        navigation.emit("didAppear", { screenId })
        stableRef.current.onAppear?.()
      },
      onDisappear: () => {
        navigation.emit("didDisappear", { screenId })
        stableRef.current.onDisappear?.()
      },
      onWillAppear: () => {
        navigation.emit("willAppear", { screenId })
        stableRef.current.onWillAppear?.()
      },
      onWillDisappear: () => {
        navigation.emit("willDisappear", { screenId })
        stableRef.current.onWillDisappear?.()
      },
    }
  }, [navigation, screenId])
}
