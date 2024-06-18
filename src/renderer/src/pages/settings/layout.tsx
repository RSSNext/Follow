import { Logo } from "@renderer/components/icons/logo"
import { Vibrancy } from "@renderer/components/ui/background"
import { settingTabs } from "@renderer/lib/constants"
import { SettingsTitle } from "@renderer/modules/settings/title"
import { Link, Outlet, useLocation } from "react-router-dom"

export function Component() {
  const location = useLocation()
  const tab = location.pathname.replace(/^\/settings\/?/, "")

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1">
        <Vibrancy className="w-44 border-r px-2.5 py-3 pt-3.5">
          <div className="mb-3 flex justify-end">

            <Logo className="size-6" />
          </div>
          {settingTabs.map((t) => (
            <Link
              key={t.path}
              className={`my-1 flex items-center rounded-md px-2.5 py-0.5 leading-loose text-theme-foreground/70 transition-colors ${
                tab === t.path ? "bg-native-active text-theme-foreground/90" : ""
              }`}
              to={`/settings/${t.path}`}
            >
              <SettingsTitle path={t.path} className="text-[15px] font-medium" />
            </Link>
          ))}
        </Vibrancy>
        <div className="h-screen flex-1 overflow-y-auto bg-theme-background p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
