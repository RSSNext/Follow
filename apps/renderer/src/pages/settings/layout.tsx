import { IN_ELECTRON } from "@follow/shared/constants"
import { Outlet, useLocation } from "react-router-dom"

import { Logo } from "~/components/icons/logo"
import { WindowUnderBlur } from "~/components/ui/background"
import { isElectronBuild } from "~/constants"
import { preventDefault } from "~/lib/dom"
import { cn } from "~/lib/utils"
import { useActivationModal } from "~/modules/activation"
import { IsInSettingIndependentWindowContext } from "~/modules/settings/context"
import {
  useAvailableSettings,
  useSettingPageContext,
} from "~/modules/settings/hooks/use-setting-ctx"
import { SettingsSidebarTitle } from "~/modules/settings/title"
import type { SettingPageConfig } from "~/modules/settings/utils"
import { DisableWhy } from "~/modules/settings/utils"

function Layout() {
  const location = useLocation()
  const tab = location.pathname.replace(/^\/settings\/?/, "")
  const availableSettings = useAvailableSettings()

  return (
    <div className="flex h-screen flex-col" onContextMenu={preventDefault}>
      <div className="flex flex-1">
        <WindowUnderBlur className="flex h-full w-44 flex-col border-r px-2.5 py-3 pt-3.5">
          <div className="grow pt-8">
            {availableSettings.map((t) => (
              <SettingItemButton key={t.path} tab={tab} item={t} path={t.path} />
            ))}
          </div>

          <div className="center my-3 flex">
            <Logo className="size-6" />
            <span className="ml-2 font-semibold">{APP_NAME}</span>
          </div>
        </WindowUnderBlur>
        <div className="h-screen flex-1 overflow-y-auto bg-theme-background p-8 pt-0">
          <IsInSettingIndependentWindowContext.Provider value={true}>
            <Outlet />
          </IsInSettingIndependentWindowContext.Provider>
        </div>
      </div>
    </div>
  )
}
// NOTE: we disable directly nav to setting routes on the web app
export const Component = isElectronBuild ? Layout : () => null

const SettingItemButton = (props: { tab: string; item: SettingPageConfig; path: string }) => {
  const { tab, item, path } = props
  const { disableIf } = item

  const ctx = useSettingPageContext()

  const [disabled, why] = disableIf?.(ctx) || [false, DisableWhy.Noop]
  const presentActivationModal = useActivationModal()

  return (
    <button
      className={cn(
        "my-0.5 flex w-full items-center rounded-lg px-2.5 py-0.5 leading-loose text-theme-foreground/70",
        tab === path && "!bg-theme-item-active !text-theme-foreground/90",
        !IN_ELECTRON && "duration-200 hover:bg-theme-item-hover",
        disabled && "cursor-not-allowed opacity-50",
      )}
      type="button"
      onClick={() => {
        if (disabled) {
          switch (why) {
            case DisableWhy.NotActivation: {
              presentActivationModal()
              break
            }
            case DisableWhy.Noop: {
              break
            }
          }
        }
      }}
    >
      <SettingsSidebarTitle path={path} className="text-[0.94rem] font-medium" />
    </button>
  )
}
