import { cn } from "~/lib/utils"

export const StarIcon: Component = ({ className }) => (
  <i
    className={cn("i-mgc-star-cute-fi absolute right-0 top-0 text-base text-orange-400", className)}
  />
)
