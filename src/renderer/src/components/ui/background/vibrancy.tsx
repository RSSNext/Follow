import { useUISettingKey } from "@renderer/atoms/settings/ui"
import { cn } from "@renderer/lib/utils"

export const Vibrancy: Component<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ className, children, ...rest }) => {
  const opaqueSidebar = useUISettingKey("opaqueSidebar")
  const canVibrancy =
    ELECTRON &&
    window.electron!.process.platform === "darwin" &&
    !opaqueSidebar

  return (
    <div
      className={cn(
        canVibrancy ? "bg-native/50 dark:bg-native/10" : "bg-native",

        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
