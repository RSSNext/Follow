import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface Back2CuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const Back2CuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: Back2CuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        fill={color}
        d="M10.704 12.858a1 1 0 0 0-.86-1.806zM4.319 7.182a1 1 0 1 0-1.991-.189zM12.499 7v1zm7.5 8.5a1 1 0 1 0 2 0zM4.644 13.02l-.073.998zm5.202-1.968c-1.688.802-3.296 1.106-5.129.971l-.146 1.995c2.184.16 4.137-.211 6.134-1.16zm-4.692 1.277c-.752-1.674-1.01-3.284-.834-5.147l-1.991-.189c-.209 2.198.103 4.157 1 6.156zM12.5 8a7.5 7.5 0 0 1 7.5 7.5h2A9.5 9.5 0 0 0 12.5 6zm-7.17 5.294A7.504 7.504 0 0 1 12.5 8V6a9.502 9.502 0 0 0-9.082 6.706zm-.614-1.27a.52.52 0 0 1 .437.305l-1.824.82a1.48 1.48 0 0 0 1.24.869z"
      />
    </Svg>
  )
}
