import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface ArrowLeftCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const ArrowLeftCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: ArrowLeftCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 12h15m-10 5.657c-2.109-1.055-3.591-2.66-4.897-4.522-.372-.53-.559-.796-.55-1.124.007-.33.208-.588.609-1.105C6.538 9.132 8.044 7.55 10 6.343"
      />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 12h15m-10 5.657a15.962 15.962 0 0 1-4.98-4.63c-.335-.473-.501-.71-.501-1.027 0-.317.166-.554.5-1.028A15.962 15.962 0 0 1 10 6.343"
      />
    </Svg>
  )
}
