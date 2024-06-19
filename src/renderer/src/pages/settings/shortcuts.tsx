import { shortcuts } from "@renderer/lib/shortcuts"
import { cn } from "@renderer/lib/utils"
import { SettingsTitle } from "@renderer/modules/settings/title"

export function Component() {
  return (
    <>
      <SettingsTitle path="shortcuts" className="mb-4" />
      <div className="space-y-6">
        {Object.keys(shortcuts).map((type) => (
          <section key={type}>
            <div className="mb-2 text-sm capitalize">{type}</div>
            <div className="rounded-md border text-[13px] text-zinc-600">
              {Object.keys(shortcuts[type]).map((action, index) => (
                <div key={`${type}-${action}`} className={cn("flex items-center justify-between px-3 py-1.5", index % 2 && "bg-native/40")}>
                  <div>{shortcuts[type][action].name}</div>
                  <div>{shortcuts[type][action].key}</div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
