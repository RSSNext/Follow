import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface DocmentCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const DocmentCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: DocmentCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeWidth={2}
        d="M9 9h6m-6 5h3m0 7.5v0c3.287 0 4.931 0 6.038-.908.202-.166.388-.352.554-.554.908-1.107.908-2.75.908-6.038v-4c0-3.287 0-4.931-.908-6.038a4 4 0 0 0-.554-.554C16.93 2.5 15.288 2.5 12 2.5v0c-3.287 0-4.931 0-6.038.908a4 4 0 0 0-.554.554C4.5 5.07 4.5 6.712 4.5 10v4c0 3.288 0 4.931.908 6.038a4 4 0 0 0 .554.554c1.107.908 2.75.908 6.038.908Z"
      />
    </Svg>
  )
}
