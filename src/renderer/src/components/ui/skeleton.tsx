import { cn } from "@renderer/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200 dark:bg-neutral-800", className)}
      {...props}
    />
  )
}

export { Skeleton }
