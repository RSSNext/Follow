/**
 * @see https://github.com/toeverything/AFFiNE/blob/98e35384a6f71bf64c668b8f13afcaf28c9b8e97/packages/frontend/core/src/modules/find-in-page/view/find-in-page-modal.tsx
 * @copyright AFFiNE, Follow
 */
import { tipcClient } from "@renderer/lib/client"
import { observeResize } from "@renderer/lib/observe-resize"
import { useEffect, useRef, useState } from "react"
import { useDebounceCallback } from "usehooks-ts"

const CmdFImpl = () => {
  const [value, setValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const [isSearching, setIsSearching] = useState(false)

  const searchIdRef = useRef<number>(0)
  const nativeSearch = useDebounceCallback(
    async (
      text: string,

      dir: "forward" | "backward" = "forward",
    ) => {
      setIsSearching(true)

      const searchId = ++searchIdRef.current

      let findNext = true
      if (!text) {
        await tipcClient?.clearSearch()
      } else {
        await tipcClient
          ?.search({
            text,
            options: {
              findNext,
              forward: dir === "forward",
            },
          })
          .finally(() => {
            if (searchId === searchIdRef.current) {
              setIsSearching(false)
              findNext = false
            }
          })
      }
    },
    500,
  )
  useEffect(() => {
    inputRef.current?.focus()
    setTimeout(() => {
      inputRef.current?.focus()
    })
  }, [isSearching])
  return (
    <form className="center fixed right-8 top-12 z-[1000] size-9 w-64 rounded-2xl border bg-neutral-800/80 px-3 backdrop-blur">
      <div className="relative size-full">
        <input
          ref={inputRef}
          name="search"
          className="absolute inset-0 size-full appearance-none bg-transparent font-[system-ui] text-[15px] text-transparent"
          style={{
            visibility: isSearching ? "hidden" : "visible",
          }}
          type="text"
          value={value}
          onChange={async (e) => {
            e.preventDefault()
            const search = e.target.value
            setValue(search)
            setIsSearching(false)
            nativeSearch(search)
          }}
        />

        <CanvasText
          className="pointer-events-none absolute inset-0 size-full text-transparent [&::placeholder]:text-foreground"
          text={value}
        />
      </div>
    </form>
  )
}

const drawText = (canvas: HTMLCanvasElement, text: string) => {
  const ctx = canvas.getContext("2d")
  if (!ctx) {
    return
  }

  const dpr = window.devicePixelRatio || 1
  canvas.width = canvas.getBoundingClientRect().width * dpr
  canvas.height = canvas.getBoundingClientRect().height * dpr

  const textColor = `#fff`

  ctx.scale(dpr, dpr)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = textColor
  ctx.font = "15px system-ui"

  ctx.fillText(text, 0, 22)
  ctx.textAlign = "left"
  ctx.textBaseline = "middle"
}

const CanvasText = ({
  text,
  className,
}: {
  text: string
  className: string
}) => {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) {
      return
    }
    drawText(canvas, text)
    return observeResize(canvas, () => drawText(canvas, text))
  }, [text])

  return <canvas className={className} ref={ref} />
}

export const CmdF = CmdFImpl
