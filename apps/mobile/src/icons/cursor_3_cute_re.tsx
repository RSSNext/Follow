import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface Cursor3CuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const Cursor3CuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: Cursor3CuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6.167 6.172 4.752 4.757m7.072 1.415 1.414-1.415M8.995 5V3m-4 6h-2m1.758 4.243 1.414-1.414m10.854 2.835-.91.383c-.371.156-.557.234-.695.373-.139.139-.217.324-.373.695l-.382.909c-.707 1.679-1.06 2.518-1.726 2.517-.665-.001-1.002-.81-1.675-2.429a34.465 34.465 0 0 1-1.766-5.472c-.273-1.178-.409-1.766-.017-2.158.392-.393.981-.256 2.159.016 1.875.434 3.7 1.028 5.473 1.766 1.618.673 2.427 1.01 2.428 1.675.002.666-.837 1.019-2.516 1.725"
      />
    </Svg>
  )
}
