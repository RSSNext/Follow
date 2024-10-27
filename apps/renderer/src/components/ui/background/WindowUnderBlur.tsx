import { Focusable } from "@follow/components/common/Focusable.js"
import { SYSTEM_CAN_UNDER_BLUR_WINDOW } from "@follow/shared/constants"
import { cn } from "@follow/utils/utils"

import { useUISettingKey } from "~/atoms/settings/ui"

type Props = Component<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>
const MacOSVibrancy: Props = ({ className, children, ...rest }) => (
  <Focusable className={cn("bg-native/30 dark:bg-native/10", className)} {...rest}>
    {children}
  </Focusable>
)

const Noop: Props = ({ children, className, ...rest }) => (
  <Focusable className={cn("bg-native", className)} {...rest}>
    {children}
  </Focusable>
)

// Disable blur effect on Windows, because electron backgroundMaterial has some issues
// const Win32Material: Props = ({ className, children, ...rest }) => (
//   <div className={cn("bg-transparent", className)} {...rest}>
//     {children}
//   </div>
// )
export const WindowUnderBlur: Props = SYSTEM_CAN_UNDER_BLUR_WINDOW
  ? (props) => {
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
          return <Noop {...props} />
        }
        default: {
          return <Noop {...props} />
        }
      }
    }
  : Noop
