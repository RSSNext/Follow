import { useHover } from "@use-gesture/react"
import { useRef, useState } from "react"

export const EntryTranslation: Component<{
  source?: string | null
  target?: string
}> = ({ source, target, className }) => {
  let nextTarget = target
  if (source === target) {
    nextTarget = undefined
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
    <div ref={ref} className={className}>
      {nextTarget && !hovered ? (
        <>
          <i className="i-mgc-magic-2-cute-re mr-1 align-middle" />
          <span className="align-middle">{nextTarget}</span>
        </>
      ) : (
        <span className="align-middle">{source}</span>
      )}
    </div>
  )
}
