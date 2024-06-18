import { cn } from "@renderer/lib/utils"

interface LoadingCircleProps {
  size: "small" | "medium" | "large"
}

const sizeMap = {
  small: "text-md",
  medium: "text-xl",
  large: "text-3xl",
}
export const LoadingCircle: Component<LoadingCircleProps> = ({
  className,
  size,
}) => (
  <div className={cn(sizeMap[size], className)}>
    <i className="i-mgc-loading-3-cute-re animate-spin" />
  </div>
)
