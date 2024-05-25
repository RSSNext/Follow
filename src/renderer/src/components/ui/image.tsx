import { getProxyUrl } from "@renderer/lib/img-proxy"
import { cn } from "@renderer/lib/utils"
import type { ImgHTMLAttributes } from "react"
import { useState } from "react"

const failedList = new Set<string | undefined>()
export const Image = ({
  className,
  proxy,
  ...props
}: ImgHTMLAttributes<HTMLImageElement> & {
  proxy?: {
    width: number
    height: number
  }
}) => {
  const [hidden, setHidden] = useState(!props.src)
  const [imgSrc, setImgSrc] = useState(
    proxy && props.src && !failedList.has(props.src) ?
      getProxyUrl({
        url: props.src,
        width: proxy.width,
        height: proxy.height,
      }) :
      props.src,
  )

  const errorHandle = (e) => {
    if (imgSrc !== props.src) {
      setImgSrc(props.src)
      failedList.add(props.src)
    } else {
      setHidden(true)
      props.onError?.(e)
    }
  }

  return (
    <div className={cn("overflow-hidden rounded bg-stone-100", className)}>
      <img
        {...props}
        onError={errorHandle}
        className={cn(hidden && "hidden", "size-full object-cover")}
        src={imgSrc}
      />
    </div>
  )
}
