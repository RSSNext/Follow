import { KbdCombined } from "@renderer/components/ui/kbd/Kbd"
import { shortcuts } from "@renderer/constants/shortcuts"
import { cn } from "@renderer/lib/utils"
import { SettingsTitle } from "@renderer/modules/settings/title"
import { defineSettingPageData } from "@renderer/modules/settings/utils"
import { useTranslation } from "react-i18next"

const iconName = "i-mgc-hotkey-cute-re"
const priority = 1040

export const loader = defineSettingPageData({
  iconName,
  name: "settings.titles.shortcuts",
  priority,
})
export function Component() {
  const { t } = useTranslation()
  return (
    <>
      <SettingsTitle />

      <div className="mt-4 space-y-6">
        {Object.keys(shortcuts).map((type) => (
          <section key={type}>
            <div className="mb-2 text-sm font-medium capitalize">{type}</div>
            <div className="rounded-md border text-[13px] text-zinc-600 dark:text-zinc-300">
              {Object.keys(shortcuts[type]).map((action, index) => (
                <div
                  key={`${type}-${action}`}
                  className={cn(
                    "flex items-center justify-between px-3 py-1.5",
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
