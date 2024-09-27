import { AnimatePresence } from "framer-motion"
import { useEffect, useRef, useState } from "react"

import { useShowSourceContent } from "~/atoms/source-content"
import { m } from "~/components/common/Motion"
import { softSpringPreset } from "~/components/ui/constants/spring"

import { EntryContentLoading } from "../loading"

const ViewTag = window.electron ? "webview" : "iframe"
const variants = {
  hidden: { x: "100%" },
  visible: { x: 0 },
  exit: { x: "100%" },
}

const Banner = () => {
  return (
    <div className="z-50 w-full bg-yellow-600 p-3 text-white">
      <div className="text-center">
        <p>Some websites can't be displayed here. Download desktop app to view it.</p>
      </div>
    </div>
  )
}

export const SourceContentView = ({ src }: { src: string | null }) => {
  const showSourceContent = useShowSourceContent()
  const [loading, setLoading] = useState(true)
  const webviewRef = useRef<HTMLIFrameElement | null>(null)

  useEffect(() => {
    const abortController = new AbortController()
    const webview = webviewRef.current
    if (!webview) {
      return
    }
    const handleDidStartLoading = () => setLoading(true)
    const handleDidStopLoading = () => setLoading(false)

    webview.addEventListener("did-start-loading", handleDidStartLoading, {
      signal: abortController.signal,
    })
    webview.addEventListener("did-stop-loading", handleDidStopLoading, {
      signal: abortController.signal,
    })

    return () => {
      abortController.abort()
    }
  }, [src, showSourceContent])

  return (
    <AnimatePresence>
      {showSourceContent && src && (
        <m.div
          className="absolute left-0 top-0 z-[1] size-full bg-theme-background"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={softSpringPreset}
        >
          {!window.electron && <Banner />}
          <div className="relative flex size-full flex-col">
            {loading && (
              <div className="center mt-16 min-w-0">
                <EntryContentLoading icon={src} />
              </div>
            )}
            <ViewTag
              ref={webviewRef}
              className="absolute left-0 top-0 size-full"
              src={src}
              sandbox="allow-scripts allow-same-origin"
              // For iframe
              onLoad={() => setLoading(false)}
            />
          </div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
