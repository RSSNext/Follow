import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface ShareForwardCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const ShareForwardCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: ShareForwardCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19.564 9.445a42.577 42.577 0 0 0-4.666-3.92c-1.195-.865-1.792-1.298-2.488-1.268a2.192 2.192 0 0 0-1.361.618c-.48.504-.549 1.251-.685 2.745-.047.513-.07.77-.162.944a.856.856 0 0 1-.285.337c-.158.118-.46.198-1.068.357C5.44 10.15 3 13.28 3 17.002c0 .479.596.666.947.34L4 17.294c1.358-1.216 3.002-1.931 4.76-2.186.446-.064.67-.097.903-.013.19.068.39.224.5.393.136.208.16.47.21.993.13 1.396.196 2.094.628 2.583.342.387.969.671 1.485.675.653.004 1.212-.399 2.33-1.205a42.576 42.576 0 0 0 4.748-3.98c1.175-1.138 1.763-1.707 1.763-2.554 0-.847-.588-1.416-1.763-2.555"
      />
    </Svg>
  )
}
