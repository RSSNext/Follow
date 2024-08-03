/**
 * @see https://github.com/toeverything/AFFiNE/blob/98e35384a6f71bf64c668b8f13afcaf28c9b8e97/packages/frontend/core/src/modules/find-in-page/view/find-in-page-modal.tsx
 * @copyright AFFiNE, Follow
 */
import { softSpringPreset } from "@renderer/components/ui/constants/spring"
import { useInputComposition, useRefValue } from "@renderer/hooks/common"
import { tipcClient } from "@renderer/lib/client"
import { nextFrame } from "@renderer/lib/dom"
import { observeResize } from "@renderer/lib/observe-resize"
import { cn } from "@renderer/lib/utils"
import { useSubscribeElectronEvent } from "@shared/event"
import { AnimatePresence, m } from "framer-motion"
import type { FC } from "react"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useDebounceCallback, useEventCallback } from "usehooks-ts"

const CmdFImpl: FC<{
  onClose: () => void
}> = ({ onClose }) => {
  const [value, setValue] = useState("")

  const currentValue = useRefValue(value)
  const inputRef = useRef<HTMLInputElement>(null)
  useLayoutEffect(() => {
    tipcClient?.readClipboard().then((text) => {
      if (!currentValue.current) {
        setValue(text)
      }
    })

    inputRef.current?.focus()
    // Select all

    nextFrame(() =>
      inputRef.current?.setSelectionRange(0, currentValue.current.length),
    )
  }, [currentValue])

  const [isSearching, setIsSearching] = useState(false)

  const searchIdRef = useRef<number>(0)

  const { isCompositionRef, ...inputProps } = useInputComposition({
    onKeyDown: useEventCallback((e) => {
      const $input = inputRef.current
      if (!$input) return

      if (e.key === "Escape") {
        nativeSearchImpl("")
        onClose()
        e.preventDefault()
      }
    }),
    onCompositionEnd: useEventCallback(() => nativeSearch(value)),
  })

  const nativeSearchImpl = useEventCallback(
    async (
      text: string,

      dir: "forward" | "backward" = "forward",
    ) => {
      if (isCompositionRef.current) return
      setIsSearching(true)

      const searchId = ++searchIdRef.current

      let findNext = true
      if (!text) {
        await tipcClient?.clearSearch().finally(() => {
          if (searchId === searchIdRef.current) {
            setIsSearching(false)
          }
        })
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
  )
  const nativeSearch = useDebounceCallback(nativeSearchImpl, 500)
  useLayoutEffect(() => {
    inputRef.current?.focus()
    setTimeout(() => {
      inputRef.current?.focus()
    })
  }, [isSearching])
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        nativeSearch(value)
      }}
      className="center fixed right-8 top-12 z-[1000] size-9 w-64 gap-2 rounded-2xl border bg-neutral-800/80 pl-3 pr-2 backdrop-blur duration-200 focus-within:border-theme-accent"
    >
      <div className="relative h-full grow">
        <input
          {...inputProps}
          ref={inputRef}
          name="search"
          className="absolute inset-0 size-full appearance-none bg-transparent font-[system-ui] text-[15px]"
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
          className={cn(
            "pointer-events-none absolute inset-0 size-full text-transparent [&::placeholder]:text-foreground",
            isSearching ? "visible" : "invisible",
          )}
          text={value}
        />
      </div>
      <div className="center gap-1 [&>*]:opacity-80">
        <button
          type="button"
          className="center hover:opacity-90"
          onClick={() => {
            nativeSearchImpl(value, "backward")
          }}
        >
          <i className="i-mgc-back-2-cute-re" />
        </button>
        <button
          type="button"
          className="center hover:opacity-90"
          onClick={() => {
            nativeSearchImpl(value, "forward")
          }}
        >
          <i className="i-mgc-forward-2-cute-re" />
        </button>
        <button
          type="button"
          className="center hover:opacity-90"
          onClick={() => {
            setValue("")
            nativeSearchImpl("")
            onClose()
          }}
        >
          <i className="i-mingcute-close-circle-fill" />
        </button>
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

  const rootStyles = getComputedStyle(document.documentElement)

  const textColor = `hsl(${rootStyles
    .getPropertyValue("--foreground")
    .trim()})`

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

export const CmdF = () => {
  const [show, setShow] = useState(false)

  useSubscribeElectronEvent("OpenSearch", () => {
    setShow(true)
  })
  return (
    <AnimatePresence>
      {show && (
        <m.div
          initial={{ opacity: 0.8, y: -150 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -150 }}
          transition={softSpringPreset}
        >
          <CmdFImpl
            onClose={() => {
              setShow(false)
            }}
          />
        </m.div>
      )}
    </AnimatePresence>
  )
}
