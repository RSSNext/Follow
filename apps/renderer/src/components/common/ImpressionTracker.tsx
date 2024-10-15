import { memo, useState } from "react"
import { useInView } from "react-intersection-observer"

type ImpressionProps = {
  event: string
  onTrack?: () => any
  properties?: Record<string, any>
}
export const ImpressionView: Component<{ shouldTrack?: boolean } & ImpressionProps> = (props) => {
  const { shouldTrack = true, ...rest } = props
  if (!shouldTrack) {
    return <>{props.children}</>
  }
  return <ImpressionViewImpl {...rest} />
}

const ImpressionViewImpl: Component<ImpressionProps> = memo((props) => {
  const [impression, setImpression] = useState(false)

  const { ref } = useInView({
    initialInView: false,
    triggerOnce: true,
    onChange(inView) {
      if (!inView) {
        return
      }
      setImpression(true)

      window.analytics?.capture(props.event, {
        impression: 1,
        ...props.properties,
      })
      props.onTrack?.()
    },
  })

  return (
    <>
      {props.children}
      {!impression && <span ref={ref} />}
    </>
  )
})

ImpressionViewImpl.displayName = "ImpressionView"
