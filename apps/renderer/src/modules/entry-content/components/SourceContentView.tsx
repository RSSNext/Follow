import { IN_ELECTRON } from "@follow/shared/constants"
import { AnimatePresence } from "framer-motion"
import { useEffect, useRef, useState } from "react"

import { useShowSourceContent } from "~/atoms/source-content"
import { m } from "~/components/common/Motion"
import { softSpringPreset } from "~/components/ui/constants/spring"

import { EntryContentLoading } from "../loading"

const ViewTag = IN_ELECTRON ? "webview" : "iframe"
const variants = {
  hidden: { x: "100%" },
  visible: { x: 0 },
  exit: { x: "100%" },
}

export const SourceContentView = ({ src }: { src: string }) => {
  const showSourceContent = useShowSourceContent()
  const [loading, setLoading] = useState(true)
  const webviewRef = useRef<HTMLIFrameElement | null>(null)

  useEffect(() => {
    const abortController = new AbortController()
    const webview = webviewRef.current
    if (!webview) return
    const handleDidStopLoading = () => setLoading(false)

    // See https://www.electronjs.org/docs/latest/api/webview-tag#example
    webview.addEventListener("did-stop-loading", handleDidStopLoading, {
      signal: abortController.signal,
    })

    return () => {
      abortController.abort()
    }
  }, [src, showSourceContent])

  return (
    <>
      <div className="relative flex size-full flex-col">
        {loading && (
          <div className="center mt-16 min-w-0">
            <EntryContentLoading icon={src} />
          </div>
        )}
        <m.div
          className="size-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: loading ? 0 : 1 }}
          transition={softSpringPreset}
        >
          <ViewTag
            ref={webviewRef}
            className="size-full"
            src={src}
            sandbox="allow-scripts allow-same-origin"
            // For iframe
            onLoad={() => setLoading(false)}
          />
        </m.div>
      </div>
    </>
  )
}

export const SourceContentPanel = ({ src }: { src: string | null }) => {
  const showSourceContent = useShowSourceContent()
  return (
    <AnimatePresence>
      {showSourceContent && src && (
        <m.div
          data-hide-in-print
          className="absolute left-0 top-0 z-[1] size-full bg-theme-background"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={softSpringPreset}
        >
          <SourceContentView src={src} />
        </m.div>
      )}
    </AnimatePresence>
  )
}
