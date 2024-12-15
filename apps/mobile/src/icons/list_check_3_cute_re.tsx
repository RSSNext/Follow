import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface ListCheck3CuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const ListCheck3CuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: ListCheck3CuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4h8m-8 4h4m-4 6h8m-8 4h4M5.5 19.25c.465 0 .697 0 .89-.034a2.25 2.25 0 0 0 1.826-1.825c.034-.194.034-.426.034-.891v0c0-.465 0-.697-.034-.89a2.25 2.25 0 0 0-1.825-1.826c-.194-.034-.426-.034-.891-.034v0c-.465 0-.697 0-.89.034a2.25 2.25 0 0 0-1.826 1.825c-.034.194-.034.426-.034.891v0c0 .465 0 .697.034.89a2.25 2.25 0 0 0 1.825 1.826c.194.034.426.034.891.034m0-10c.465 0 .697 0 .89-.034A2.25 2.25 0 0 0 8.217 7.39c.034-.194.034-.426.034-.891v0c0-.465 0-.697-.034-.89A2.25 2.25 0 0 0 6.39 3.783c-.194-.034-.426-.034-.891-.034v0c-.465 0-.697 0-.89.034A2.25 2.25 0 0 0 2.783 5.61c-.034.194-.034.426-.034.891v0c0 .465 0 .697.034.89A2.25 2.25 0 0 0 4.61 9.217c.194.034.426.034.891.034"
      />
    </Svg>
  )
}
