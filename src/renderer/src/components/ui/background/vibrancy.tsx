import { useUISettingKey } from "@renderer/atoms/settings/ui"
import { cn } from "@renderer/lib/utils"

type Props = Component<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>
const MacOSVibrancy: Props = ({ className, children, ...rest }) => (
  <div className={cn("bg-native/50 dark:bg-native/10", className)} {...rest}>
    {children}
  </div>
)

const Noop: Props = ({ children, className, ...rest }) => (
  <div className={cn("bg-native", className)} {...rest}>
    {children}
  </div>
)

const Win32Material: Props = ({ className, children, ...rest }) => (
  <div className={cn("bg-transparent", className)} {...rest}>
    {children}
  </div>
)
export const WindowUnderBlur: Props = (props) => {
  const opaqueSidebar = useUISettingKey("opaqueSidebar")
  if (opaqueSidebar) {
    return <Noop {...props} />
  }

  if (!window.electron) {
    return <Noop {...props} />
  }
  switch (window.electron.process.platform) {
    case "darwin": {
      return <MacOSVibrancy {...props} />
    }
    case "win32": {
      return <Win32Material {...props} />
    }
    default: {
      return <Noop {...props} />
    }
  }
}
