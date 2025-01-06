import { useSetAtom } from "jotai"
import { useCallback } from "react"

import { loadingAtom, loadingVisibleAtom } from "../atoms/app"

export const useLoadingCallback = () => {
  const setLoadingCaller = useSetAtom(loadingAtom)
  const setVisible = useSetAtom(loadingVisibleAtom)

  return useCallback(
    (thenable: Promise<any>, options: { finish: () => any; cancel: () => any }) => {
      setLoadingCaller({
        thenable,
        finish: options.finish,
        cancel: options.cancel,
      })
      setVisible(true)
    },
    [setLoadingCaller, setVisible],
  )
}
