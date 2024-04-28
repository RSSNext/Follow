import { ImgHTMLAttributes, useState } from "react"
import { cn } from "@renderer/lib/utils"

export const Image = ({
  className,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) => {
  const [hidden, setHidden] = useState(!props.src)
  const errorHandle = (e) => {
    setHidden(true)
    props.onError?.(e)
  }

  return (
    <div className={cn(className, "bg-stone-100 rounded")}>
      <img
        onError={errorHandle}
        className={cn(hidden && "hidden", "object-cover size-full rounded")}
        {...props}
      />
    </div>
  )
}
