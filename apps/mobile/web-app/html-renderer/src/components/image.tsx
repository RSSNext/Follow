import type { HTMLProps } from "~/HTML"

export const MarkdownImage = (props: HTMLProps<"img">) => {
  const { src, ...rest } = props

  return (
    <button
      type="button"
      onClick={() => {
        if (!src) return
        const $image = new Image()
        $image.src = src
        $image.crossOrigin = "anonymous"

        $image.onload = () => {
          // Create a canvas element
          const canvas = document.createElement("canvas")
          canvas.width = $image.width
          canvas.height = $image.height

          // Draw image on canvas
          const ctx = canvas.getContext("2d")
          ctx?.drawImage($image, 0, 0)

          // Convert to base64
          const imageBase64 = canvas.toDataURL("image/png")

          // Remove base64 prefix
          const base64 = imageBase64.split(",")[1]!
          bridge.previewImage([base64])
        }
      }}
    >
      <img {...rest} src={src} />
    </button>
  )
}
