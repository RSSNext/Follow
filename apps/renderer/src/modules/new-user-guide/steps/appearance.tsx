import { AppThemeSegment, TextSize } from "~/modules/settings/tabs/apperance"
import { LanguageSelector } from "~/modules/settings/tabs/general"

export function AppearanceGuide() {
  return (
    <div className="mt-20 box-content w-[400px] space-y-4 px-6 pb-24">
      <LanguageSelector />
      <AppThemeSegment />
      <TextSize />
    </div>
  )
}
