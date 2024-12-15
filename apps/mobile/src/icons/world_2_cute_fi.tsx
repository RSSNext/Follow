import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface World2CuteFiIconProps {
  width?: number
  height?: number
  color?: string
}

export const World2CuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: World2CuteFiIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        fill={color}
        fillRule="evenodd"
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10M7.995 10.957l-.16-.049A1.887 1.887 0 0 1 6.5 9.104v-2.59a2 2 0 0 1 .031-.353A7.972 7.972 0 0 1 12 4c.484 0 .957.043 1.418.125a1.664 1.664 0 0 1-.97 2.615l-.81.185a1.784 1.784 0 0 0-1.362 2.033 1.784 1.784 0 0 1-2.281 2m6.322 7.154a1.8 1.8 0 0 0 1.017 1.163 8.021 8.021 0 0 0 2.533-1.835 2.234 2.234 0 0 0-.006-.051l-.228-1.826a2 2 0 0 0-1.09-1.54l-1-.5a1.822 1.822 0 0 0-2.104 2.917l.194.195a2 2 0 0 1 .51.864z"
        clipRule="evenodd"
      />
    </Svg>
  )
}
