import { cn } from "@renderer/lib/utils"
import { Link, Outlet, useLocation } from "react-router-dom"

const tabs = [
  {
    name: "General",
    path: "",
    className: "i-mingcute-settings-7-line",
  },
  {
    name: "RSSHub",
    path: "rsshub",
    className: "i-mingcute-palette-line",
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
      {/* <div
        className="h-10 border-b flex items-center pl-20 text-sm font-medium"
        aria-hidden
      >
        Follow Settings
      </div> */}
      <div className="flex flex-1">
        <div className="border-r w-44 p-3 bg-native pt-10">
          <div className="font-bold text-xl flex items-center gap-1 mx-2 mb-3">
            <img src="./icon.svg" alt="logo" className="size-6" />
            Settings
          </div>
          {tabs.map((t) => (
            <Link
              key={t.path}
              className={`flex items-center text-[15px] rounded transition-colors px-2 py-1 text-zinc-600 h-8 ${
                tab === t.path ? "bg-native-active text-zinc-900" : ""
              }`}
              to={`/settings/${t.path}`}
            >
              <i className={cn("mr-2", t.className)}></i>
              <span>{t.name}</span>
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
