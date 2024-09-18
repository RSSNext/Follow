import { Link, Outlet, useLocation } from "react-router-dom"

import { Logo } from "~/components/icons/logo"
import { WindowUnderBlur } from "~/components/ui/background"
import { isElectronBuild } from "~/constants"
import { preventDefault } from "~/lib/dom"
import { settings } from "~/modules/settings/constants"
import { SettingsSidebarTitle } from "~/modules/settings/title"

function Layout() {
  const location = useLocation()
  const tab = location.pathname.replace(/^\/settings\/?/, "")

  return (
    <div className="flex h-screen flex-col" onContextMenu={preventDefault}>
      <div className="flex flex-1">
        <WindowUnderBlur className="flex h-full w-44 flex-col border-r px-2.5 py-3 pt-3.5">
          <div className="grow pt-8">
            {settings.map((t) => (
              <Link
                key={t.path}
                className={`my-1 flex cursor-default items-center rounded-md px-2.5 py-0.5 leading-loose text-theme-foreground/70 transition-colors dark:text-theme-foreground/90 ${
                  tab === t.path ? "bg-native-active text-theme-foreground/90" : ""
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
        </WindowUnderBlur>
        <div className="h-screen flex-1 overflow-y-auto bg-theme-background p-8 pt-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
// NOTE: we disable directly nav to setting routes on the web app
export const Component = isElectronBuild ? Layout : () => null
