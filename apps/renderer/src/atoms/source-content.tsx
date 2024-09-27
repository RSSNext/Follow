import { atom } from "jotai"
import { useCallback } from "react"

import { useModalStack } from "~/components/ui/modal"
import { createAtomHooks } from "~/lib/jotai"

export const [, , useShowSourceContent, , getShowSourceContent, setShowSourceContent] =
  createAtomHooks(atom<boolean>(false))

export const toggleShowSourceContent = () => setShowSourceContent(!getShowSourceContent())
export const resetShowSourceContent = () => setShowSourceContent(false)

export const useSourceContentModal = () => {
  const { present } = useModalStack()

  return useCallback(
    ({ title, src }: { title?: string; src: string }) => {
      const ViewTag = window.electron ? "webview" : "iframe"
      present({
        id: src,
        title,
        content: () => <ViewTag src={src} style={{ width: "100%", height: "100%" }} />,
        resizeable: true,
        clickOutsideToDismiss: true,
        // The number was picked arbitrarily
        resizeDefaultSize: { width: 900, height: 900 },
      })
    },
    [present],
  )
}
