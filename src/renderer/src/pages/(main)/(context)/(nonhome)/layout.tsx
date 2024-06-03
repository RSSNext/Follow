import { Link, Outlet } from "react-router-dom"

export function Component() {
  return (
    <div className="relative flex size-full">
      <Link to="/" className="absolute left-10 top-11 flex items-center gap-1">
        <i className="i-mingcute-back-line" />
        Back
      </Link>
      <Outlet />
    </div>
  )
}
