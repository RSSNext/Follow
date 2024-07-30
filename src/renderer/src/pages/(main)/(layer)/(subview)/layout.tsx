import { getReadonlyRoute } from "@renderer/atoms/route"
import {
  getSidebarActiveView,
  setSidebarActiveView,
} from "@renderer/atoms/sidebar"
import { MotionButtonBase } from "@renderer/components/ui/button"
import { useRef } from "react"
import { Outlet, useNavigate } from "react-router-dom"

export function Component() {
  const navigate = useNavigate()
  const prevLocation = useRef(getReadonlyRoute().location).current
  const prevView = useRef(getSidebarActiveView()).current
  return (
    <div className="relative flex size-full">
      <MotionButtonBase
        onClick={() => {
          navigate(prevLocation)

          setSidebarActiveView(prevView)
        }}
        className="absolute left-10 top-11 z-[1] flex items-center gap-1"
      >
        <i className="i-mgc-left-cute-fi" />
        Back
      </MotionButtonBase>
      <Outlet />
    </div>
  )
}
