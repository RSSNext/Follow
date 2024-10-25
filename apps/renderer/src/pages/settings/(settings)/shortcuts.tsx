import { cn } from "@follow/utils/utils"
import { useTranslation } from "react-i18next"

import { KbdCombined } from "~/components/ui/kbd/Kbd"
import { shortcuts, shortcutsType } from "~/constants/shortcuts"
import { SettingsTitle } from "~/modules/settings/title"
import { defineSettingPageData } from "~/modules/settings/utils"

const iconName = "i-mgc-hotkey-cute-re"
const priority = 1080

export const loader = defineSettingPageData({
  iconName,
  name: "titles.shortcuts",
  priority,
})
export function Component() {
  const { t } = useTranslation("shortcuts")
  return (
    <>
      <SettingsTitle />

      <div className="mt-4 space-y-6">
        {Object.keys(shortcuts).map((type) => (
          <section key={type}>
            <div className="mb-2 text-sm font-medium capitalize">{t(shortcutsType[type])}</div>
            <div className="rounded-md border text-[13px] text-zinc-600 dark:text-zinc-300">
              {Object.keys(shortcuts[type]).map((action, index) => (
                <div
                  key={`${type}-${action}`}
                  className={cn(
                    "flex h-9 items-center justify-between px-3 py-1.5",
                    index % 2 && "bg-native/40",
                  )}
                >
                  <div>{t(shortcuts[type][action].name)}</div>
                  <div>
                    <KbdCombined joint>
                      {`${shortcuts[type][action].key}${shortcuts[type][action].extra ? `, ${shortcuts[type][action].extra}` : ""}`}
                    </KbdCombined>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
