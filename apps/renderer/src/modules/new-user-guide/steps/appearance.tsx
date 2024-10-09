import { AppThemeSegment, TextSize } from "~/modules/settings/tabs/apperance"
import { LanguageSelector } from "~/modules/settings/tabs/general"

export function AppearanceGuide() {
  return (
    <div className="space-y-4">
      <LanguageSelector />
      <AppThemeSegment />
      <TextSize />
    </div>
  )
}
