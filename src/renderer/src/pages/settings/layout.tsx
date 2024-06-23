import { Logo } from "@renderer/components/icons/logo"
import { Vibrancy } from "@renderer/components/ui/background"
import { APP_NAME } from "@renderer/lib/constants"
import { preventDefault } from "@renderer/lib/dom"
import { settings } from "@renderer/modules/settings/constants"
import {
  SettingsSidebarTitle,
} from "@renderer/modules/settings/title"
import { Link, Outlet, useLocation } from "react-router-dom"

// TODO Web UI
export function Component() {
  const location = useLocation()
  const tab = location.pathname.replace(/^\/settings\/?/, "")

  return (
    <div className="flex h-screen flex-col" onContextMenu={preventDefault}>
      <div className="flex flex-1">
        <Vibrancy className="flex h-full w-44 flex-col border-r px-2.5 py-3 pt-3.5">
          <div className="grow pt-8">
            {settings.map((t) => (
              <Link
                key={t.path}
                className={`my-1 flex items-center rounded-md px-2.5 py-0.5 leading-loose text-theme-foreground/70 transition-colors dark:text-theme-foreground/90 ${
                  tab === t.path ?
                    "bg-native-active text-theme-foreground/90" :
                    ""
                }`}
                to={`/settings/${t.path}`}
              >
                <SettingsSidebarTitle path={t.path} />
              </Link>
            ))}
          </div>

          <div className="center my-3 flex">
            <Logo className="size-6" />
            <span className="ml-2 font-semibold">{APP_NAME}</span>
          </div>
        </Vibrancy>
        <div className="h-screen flex-1 overflow-y-auto bg-theme-background p-8 pt-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
