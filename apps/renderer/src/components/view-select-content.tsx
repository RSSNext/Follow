import { useTranslation } from "react-i18next"

import { SelectContent, SelectItem } from "~/components/ui/select"
import { views } from "~/constants"
import { cn } from "~/lib/utils"

export const ViewSelectContent = () => {
  const { t } = useTranslation()

  return (
    <SelectContent>
      {views.map((view, index) => (
        <SelectItem key={view.name} value={`${index}`}>
          <div className="flex items-center gap-2">
            <span className={cn(view.className, "flex")}>{view.icon}</span>
            <span>{t(view.name)}</span>
          </div>
        </SelectItem>
      ))}
    </SelectContent>
  )
}
