import { tipcClient } from "@renderer/lib/client"
import { useQuery } from "@tanstack/react-query"
import { useForceUpdate } from "framer-motion"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export const Titlebar = () => {
  const [update] = useForceUpdate()
  const location = useLocation()
  useEffect(() => {
    update()
  }, [location])
  const { data: isMaximized, refetch } = useQuery({
    queryFn: () => tipcClient?.getWindowIsMaximized(),
    queryKey: ["windowIsMaximized"],
  })

  return (
    <div className="flex h-10 w-full items-center justify-end rounded-t-[12px] pr-1">
      <button
        className="no-drag-region pointer-events-auto flex h-[24px] w-[32px] items-center justify-center rounded duration-200 hover:bg-theme-item-active"
        type="button"
        onClick={() => {
          tipcClient?.windowAction({ action: "minimize" })
        }}
      >
        <i className="i-mingcute-minimize-line" />
      </button>

      <button
        type="button"
        className="no-drag-region pointer-events-auto flex h-[24px] w-[32px] items-center justify-center rounded duration-200 hover:bg-theme-item-active"
        onClick={async () => {
          await tipcClient?.windowAction({ action: "maximum" })
          refetch()
        }}
      >
        {isMaximized ? <i className="i-mingcute-restore-line" /> : <i className="i-mingcute-square-line" />}
      </button>

      <button
        type="button"
        className="no-drag-region pointer-events-auto flex h-[24px] w-[32px] items-center justify-center rounded duration-200 hover:bg-red-500 hover:!text-white"
        onClick={() => {
          tipcClient?.windowAction({ action: "close" })
        }}
      >
        <i className="i-mingcute-close-line" />
      </button>
    </div>
  )
}
