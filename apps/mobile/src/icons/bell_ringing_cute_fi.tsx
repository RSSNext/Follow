import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface BellRingingCuteFiIconProps {
  width?: number
  height?: number
  color?: string
}

export const BellRingingCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: BellRingingCuteFiIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        fill={color}
        fillRule="evenodd"
        d="M6.972 3.777a1 1 0 1 0-1.258-1.554 10.038 10.038 0 0 0-2.602 3.19 1 1 0 0 0 1.777.919 8.038 8.038 0 0 1 2.083-2.555m11.315-1.554a1 1 0 0 0-1.258 1.554 8.038 8.038 0 0 1 2.09 2.568 1 1 0 0 0 1.778-.916 10.038 10.038 0 0 0-2.61-3.206M4.5 10.5a7.5 7.5 0 0 1 15 0c0 .233-.004.468-.008.703-.02 1.163-.042 2.335.443 3.42.083.186.183.373.283.561.23.429.463.867.523 1.34a2.2 2.2 0 0 1-1.454 2.352c-.373.13-.782.128-1.176.125L17.938 19H5.89c-.395.004-.804.007-1.177-.124a2.2 2.2 0 0 1-1.454-2.353c.06-.472.294-.91.523-1.339.1-.188.2-.375.284-.561.484-1.085.463-2.257.442-3.42-.004-.235-.008-.47-.008-.703M9.17 20a3.001 3.001 0 0 0 5.66 0z"
        clipRule="evenodd"
      />
    </Svg>
  )
}
