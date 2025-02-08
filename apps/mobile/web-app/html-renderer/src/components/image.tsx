import { useRef } from "react"

import type { HTMLProps } from "~/HTML"

export const MarkdownImage = (props: HTMLProps<"img">) => {
  const { src, ...rest } = props

  const imageRef = useRef<HTMLImageElement>(null)

  return (
    <button
      type="button"
      onClick={() => {
        const $image = imageRef.current
        if (!$image) return
        const canvas = document.createElement("canvas")
        canvas.width = $image.naturalWidth
        canvas.height = $image.naturalHeight

        // Draw image on canvas
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        ctx.drawImage($image, 0, 0)

        canvas.toBlob((blob) => {
          if (!blob) return
          const reader = new FileReader()
          // eslint-disable-next-line unicorn/prefer-blob-reading-methods
          reader.readAsArrayBuffer(blob)

          reader.onloadend = () => {
            const uint8Array = new Uint8Array(reader.result as ArrayBuffer)
            bridge.previewImage({
              images: [uint8Array],
              index: 0,
            })
          }
        }, "image/png")
      }}
    >
      <img {...rest} crossOrigin="anonymous" src={src} ref={imageRef} />
    </button>
  )
}
