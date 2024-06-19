import { MotionButtonBase } from "@renderer/components/ui/button"
import { Outlet, useNavigate } from "react-router-dom"

export function Component() {
  const navigate = useNavigate()
  return (
    <div className="relative flex size-full">
      <MotionButtonBase
        onClick={() => navigate("/")}
        className="absolute left-10 top-11 flex items-center gap-1"
      >
        <i className="i-mgc-left-cute-fi" />
        Back
      </MotionButtonBase>
      <Outlet />
    </div>
  )
}
