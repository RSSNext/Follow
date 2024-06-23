import { useDark } from "@renderer/hooks"
import { cn } from "@renderer/lib/utils"
import { useUIStore } from "@renderer/store"
import { useMediaQuery } from "usehooks-ts"

export const Vibrancy: Component<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ className, children, ...rest }) => {
  const opaqueSidebar = useUIStore((s) => s.opaqueSidebar)
  const canVibrancy =
    window.electron &&
    window.electron.process.platform === "darwin" &&
    !opaqueSidebar
  const systemDark = useMediaQuery("(prefers-color-scheme: dark)")
  const { isDark } = useDark()

  return (
    <div
      className={cn(
        canVibrancy ? "bg-native/50 dark:bg-native/10" : "bg-native",
        // NOTE: if the system is light and the app is dark, we need to apply a background to the vibrancy, otherwise it will be transparent
        systemDark !== isDark && "!bg-native/75",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
