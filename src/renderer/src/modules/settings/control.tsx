import { StyledButton } from "@renderer/components/ui/button"
import { Checkbox } from "@renderer/components/ui/checkbox"
import { Label } from "@renderer/components/ui/label"
import { Switch } from "@renderer/components/ui/switch"
import { cn } from "@renderer/lib/utils"
import { useId } from "react"

export const SettingCheckbox: Component<{
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}> = ({ checked, label, onCheckedChange }) => {
  const id = useId()
  return (
    <div className="mb-2 flex items-center gap-4">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="cursor-auto"
      />
      <Label htmlFor={id}>{label}</Label>
    </div>
  )
}

export const SettingSwitch: Component<{
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}> = ({ checked, label, onCheckedChange, className }) => {
  const id = useId()
  return (
    <div
      className={cn("mb-3 flex items-center justify-between gap-4", className)}
    >
      <Label htmlFor={id}>{label}</Label>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="cursor-auto"
      />
    </div>
  )
}

export const SettingDescription: Component = ({ children, className }) => (
  <small
    className={cn(
      "block w-4/5 text-balance text-[13px] leading-tight text-gray-400 dark:text-neutral-500",
      className,
    )}
  >
    {children}
  </small>
)

export const SettingActionItem = ({
  label,
  action,
  buttonText,
}: {
  label: string
  action: () => void
  buttonText: string
}) => (
  <div className={cn("relative mb-3 mt-4 flex items-center justify-between gap-4")}>
    <div className="text-sm font-medium">{label}</div>
    <StyledButton buttonClassName="text-xs absolute right-0" onClick={action}>{buttonText}</StyledButton>
  </div>
)
