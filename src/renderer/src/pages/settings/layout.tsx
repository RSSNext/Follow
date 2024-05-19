import { cn } from "@renderer/lib/utils"
import { Link, Outlet, useLocation } from "react-router-dom"

const tabs = [
  {
    name: "General",
    path: "",
    className: "i-mingcute-settings-7-line",
  },
  {
    name: "Profile",
    path: "profile",
    className: "i-mingcute-user-setting-line",
  },
]

export function Component() {
  const location = useLocation()
  const tab = location.pathname.replace(/^\/settings\/?/, "")

  return (
    <div className="flex flex-col h-screen">
      <div
        className="h-10 border-b flex items-center pl-20 text-sm font-medium"
        aria-hidden
      >
        Follow Settings
      </div>
      <div className="flex flex-1">
        <div className="border-r w-44 p-2">
          {tabs.map((t) => (
            <Link
              key={t.path}
              className={`flex items-center h-9 text-[15px] rounded transition-colors p-2 text-zinc-600 ${
                tab === t.path ? "bg-zinc-200 text-zinc-900" : ""
              }`}
              to={`/settings/${t.path}`}
            >
              <i className={cn("m-2", t.className)}></i>
              {t.name}
            </Link>
          ))}
        </div>
        <div className="p-2">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
