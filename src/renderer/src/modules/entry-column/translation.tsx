import { useHover } from "@use-gesture/react"
import { useRef, useState } from "react"

export const EntryTranslation = ({
  source,
  target,
}: {
  source?: string | null
  target?: string
}) => {
  if (source === target) {
    target = undefined
  }

  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  useHover(
    (event) => {
      setHovered(event.active)
    },
    {
      target: ref,
    },
  )

  return (
    <div
      ref={ref}
    >
      {target && !hovered ? (
        <>
          <i className="i-mgc-magic-2-cute-re mr-1 align-middle" />
          <span className="align-middle">{target}</span>
        </>
      ) : (
        <span className="align-middle">
          {source}
        </span>
      )}
    </div>
  )
}
