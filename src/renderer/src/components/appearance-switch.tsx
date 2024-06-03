import { useDark } from "@renderer/hooks/useDark"

import { Switch } from "./ui/switch"

export function AppearanceSwitch() {
  const { isDark, toggleDark } = useDark()
  return (
    <div className="flex items-center justify-between gap-4">
      <p>Dark Mode</p>
      <Switch checked={isDark} onCheckedChange={toggleDark} />
    </div>
  )
}
