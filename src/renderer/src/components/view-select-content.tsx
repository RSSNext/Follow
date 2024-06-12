import {
  SelectContent,
  SelectItem,
} from "@renderer/components/ui/select"
import { views } from "@renderer/lib/constants"
import { cn } from "@renderer/lib/utils"

export const ViewSelectContent = () => (
  <SelectContent>
    {views.map((view, index) => (
      <SelectItem key={view.name} value={`${index}`}>
        <div className="flex items-center gap-2">
          <span className={cn(view.className, "flex")}>
            {view.icon}
          </span>
          <span>{view.name}</span>
        </div>
      </SelectItem>
    ))}
  </SelectContent>
)
