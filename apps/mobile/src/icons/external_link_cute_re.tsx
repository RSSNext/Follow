import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface ExternalLinkCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const ExternalLinkCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: ExternalLinkCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeWidth={2}
        d="M11 6.5h-.5c-2.809 0-4.213 0-5.222.674a4 4 0 0 0-1.104 1.104C3.5 9.287 3.5 10.69 3.5 13.5c0 2.809 0 4.213.674 5.222.292.437.667.812 1.104 1.104 1.009.674 2.413.674 5.222.674 2.809 0 4.213 0 5.222-.674a4.003 4.003 0 0 0 1.104-1.104c.674-1.009.674-2.413.674-5.222V13M10 14l9.5-9.5M20 9c.52-1.563.568-2.984.146-4.52-.063-.23-.095-.344-.188-.438-.094-.093-.208-.125-.437-.188C17.984 3.432 16.563 3.481 15 4"
      />
    </Svg>
  )
}
