import { Checkbox } from "@renderer/components/ui/checkbox"
import { Label } from "@renderer/components/ui/label"
import { Switch } from "@renderer/components/ui/switch"
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
}> = ({ checked, label, onCheckedChange }) => {
  const id = useId()
  return (
    <div className="mb-3 flex items-center justify-between gap-4">
      <Label htmlFor={id}>{label}</Label>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="cursor-auto"
      />
    </div>
  )
}

export const SettingDescription: Component<{ children: string }> = ({
  children,
}) => <small className="!mt-2 block w-4/5 text-balance text-[13px] leading-tight text-gray-400 dark:text-neutral-500">{children}</small>
