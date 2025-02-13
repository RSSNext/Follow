import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface Home5CuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const Home5CuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: Home5CuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3.302 9.912c-.2 0-.3 0-.345-.027a.2.2 0 0 1-.086-.248c.02-.05.099-.111.256-.234l5.19-4.037C10.085 3.99 10.97 3.301 12 3.301c1.03 0 1.914.688 3.684 2.065l5.189 4.036c.158.122.237.184.257.234a.2.2 0 0 1-.085.248c-.047.027-.147.027-.347.027-.36 0-.539 0-.688.048a1 1 0 0 0-.61.553c-.063.144-.08.323-.116.68l-.299 2.987c-.257 2.57-.385 3.854-1.08 4.758a3.999 3.999 0 0 1-1.063.962c-.969.601-2.26.601-4.842.601s-3.873 0-4.842-.6c-.41-.255-.77-.58-1.063-.963-.695-.904-.823-2.189-1.08-4.758l-.299-2.987c-.035-.357-.053-.535-.116-.678a1 1 0 0 0-.612-.554c-.149-.048-.328-.048-.686-.048z"
      />
      <Path
        stroke={color}
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14.5 13a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
      />
    </Svg>
  )
}
