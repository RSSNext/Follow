import { useDark } from "@renderer/hooks"
import { cn } from "@renderer/lib/utils"
import { useMediaQuery } from "usehooks-ts"

export const Vibrancy: Component<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ className, children, ...rest }) => {
  const canVibrancy =
    window.electron && window.electron.process.platform === "darwin"

  const systemDark = useMediaQuery("(prefers-color-scheme: dark)")
  const { isDark } = useDark()
  return (
    <div
      className={cn(
        canVibrancy ? "bg-native/10" : "bg-native",
        systemDark !== isDark && "bg-native",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
