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
    <div className="flex h-screen flex-col">
      {/* <div
        className="h-10 border-b flex items-center pl-20 text-sm font-medium"
        aria-hidden
      >
        Follow Settings
      </div> */}
      <div className="flex flex-1">
        <div className="w-44 border-r bg-native p-3 pt-10">
          <div className="mx-2 mb-5 flex items-center gap-1 text-xl font-bold">
            <img src="./icon.svg" alt="logo" className="size-6" />
            Settings
          </div>
          {tabs.map((t) => (
            <Link
              key={t.path}
              className={`my-1 flex items-center rounded-md px-2.5 py-[3px] text-[15px] font-medium leading-loose text-foreground/70 transition-colors ${
                tab === t.path ? "bg-native-active text-foreground/90" : ""
              }`}
              to={`/settings/${t.path}`}
            >
              <i className={cn("mr-2", t.className)} />
              <span>{t.name}</span>
            </Link>
          ))}
        </div>
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
