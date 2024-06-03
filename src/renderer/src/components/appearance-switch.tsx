import { useIsDark } from "@renderer/hooks/useDark"
import { useTheme } from "next-themes"

import { Switch } from "./ui/switch"

export function AppearanceSwitch() {
  const { setTheme } = useTheme()
  const isDark = useIsDark()
  return (
    <div className="flex items-center justify-between gap-4">
      {/* TODO system color mode */}
      <p>Dark Mode</p>
      <Switch
        checked={isDark}
        onCheckedChange={() => {
          setTheme(isDark ? "light" : "dark")
        }}
      />
    </div>
  )
}
