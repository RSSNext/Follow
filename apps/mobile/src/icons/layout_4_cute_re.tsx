import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface Layout4CuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const Layout4CuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: Layout4CuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeWidth={2}
        d="M9 3.5a87.692 87.692 0 0 0 0 17M13 8h3m-3 4h3m-3 4h3m4.5-4.5v1c0 3.771 0 5.657-1.172 6.828C18.157 20.5 16.271 20.5 12.5 20.5h-1c-3.771 0-5.657 0-6.828-1.172C3.5 18.157 3.5 16.271 3.5 12.5v-1c0-3.771 0-5.657 1.172-6.828C5.843 3.5 7.729 3.5 11.5 3.5h1c3.771 0 5.657 0 6.828 1.172C20.5 5.843 20.5 7.729 20.5 11.5Z"
      />
    </Svg>
  )
}
