import { SelectContent, SelectItem } from "@renderer/components/ui/select"
import { views } from "@renderer/constants"
import { cn } from "@renderer/lib/utils"
import { useTranslation } from "react-i18next"

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
