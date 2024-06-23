import { shortcuts } from "@renderer/lib/shortcuts"
import { cn } from "@renderer/lib/utils"
import { SettingsTitle } from "@renderer/modules/settings/title"
import { defineSettingPage } from "@renderer/modules/settings/utils"

const iconName = "i-mgc-hotkey-cute-re"
const name = "Shortcuts"
const priority = 1040

export const loader = defineSettingPage({
  iconName,
  name,
  priority,
})
export function Component() {
  return (
    <>
      <SettingsTitle />
      <div className="space-y-6">
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
                  <div>{shortcuts[type][action].name}</div>
                  <div>
                    {shortcuts[type][action].key.split(",").map((keys) => (
                      <kbd key={keys} className="kbd ml-1">
                        {keys}
                      </kbd>
                    ))}
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
