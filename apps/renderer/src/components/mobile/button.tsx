import { MotionButtonBase } from "@follow/components/ui/button/index.js"
import { cn } from "@follow/utils/utils"

export const HeaderTopReturnButton: Component = ({ className }) => (
  <MotionButtonBase onClick={window.history.returnBack} className={cn("center size-8", className)}>
    <i className="i-mingcute-left-line size-6" />

    <span className="sr-only">Return</span>
  </MotionButtonBase>
)
