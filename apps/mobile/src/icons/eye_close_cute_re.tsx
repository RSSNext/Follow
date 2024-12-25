import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface EyeCloseCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const EyeCloseCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: EyeCloseCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        fill={color}
        d="M15.296 14.435a1 1 0 0 0-1.932.517zm-1.285 2.932a1 1 0 1 0 1.932-.518zm5.06-5.71a1 1 0 1 0-1.414 1.414zm.354 3.182a1 1 0 1 0 1.414-1.415zm-8.788.113a1 1 0 1 0-1.932-.518zm-2.58 1.897a1 1 0 1 0 1.933.518zm-1.714-3.778a1 1 0 1 0-1.414-1.414zm-3.182.353a1 1 0 1 0 1.414 1.415zM4.96 8.716a1 1 0 0 0-1.918.568zm16 .568a1 1 0 0 0-1.918-.568zm-7.595 5.668.647 2.415 1.932-.518-.647-2.415zm4.293-1.881 1.768 1.768 1.414-1.415-1.767-1.767zm-8.952 1.364-.647 2.414 1.932.518.647-2.415zm-3.776-2.778L3.16 13.424l1.414 1.415 1.768-1.768zM3.04 9.284c2.643 8.92 15.275 8.92 17.918 0l-1.918-.568c-2.077 7.01-12.005 7.01-14.082 0z"
      />
    </Svg>
  )
}
