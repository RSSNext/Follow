import { atom, useAtom, useSetAtom } from "jotai"
import { useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

const keepAliveAtom = atom<
  Record<
    string,
    {
      node: React.ReactNode
      status: "active" | "offscreen"

      to: HTMLElement | null
    }
  >
>({})

export function KeepAliveProvider() {
  const [cache] = useAtom(keepAliveAtom)
  const ref = useRef<HTMLDivElement>(null)
  const nodesRef = useRef<Record<string, HTMLElement>>({})

  return (
    <>
      <div id="keep-alive-portal" ref={ref} />
      {Object.entries(cache).map(([name, node]) => {
        if (!nodesRef.current[name]) {
          nodesRef.current[name] = document.createElement("div")
        }
        const container = nodesRef.current[name]
        if (node.status === "offscreen" && container.parentElement !== node.to) {
          node.to?.append(container)
        } else if (node.status === "active" && container.parentElement !== ref.current) {
          ref.current?.append(container)
        }

        return createPortal(node.node, container)
      })}
    </>
  )
}

interface KeepAliveProps {
  name: string
  children: React.ReactNode
}

export const KeepAlive: React.FC<KeepAliveProps> = ({ name, children }) => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null)
  const setCache = useSetAtom(keepAliveAtom)
  useLayoutEffect(() => {
    setCache((prev) => ({
      ...prev,
      [name]: { node: children, status: "active", to: ref },
    }))

    return () => {
      setCache((prev) => {
        // Mark offscreen
        return {
          ...prev,
          [name]: { ...prev[name], status: "offscreen" },
        }
      })
    }
  }, [children, name, ref, setCache])
  return <div ref={setRef} />
}
