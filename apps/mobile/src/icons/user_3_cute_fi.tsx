import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface User3CuteFiIconProps {
  width?: number
  height?: number
  color?: string
}

export const User3CuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: User3CuteFiIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        fill={color}
        fillRule="evenodd"
        d="M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10m0 11c-2.395 0-4.575.694-6.178 1.672-.8.488-1.484 1.064-1.978 1.69C3.358 16.976 3 17.713 3 18.5c0 .845.411 1.511 1.003 1.986.56.45 1.299.748 2.084.956C7.665 21.859 9.771 22 12 22s4.335-.14 5.913-.558c.785-.208 1.524-.506 2.084-.956C20.59 20.01 21 19.345 21 18.5c0-.787-.358-1.523-.844-2.139-.494-.625-1.177-1.2-1.978-1.69C16.575 13.695 14.395 13 12 13"
        clipRule="evenodd"
      />
    </Svg>
  )
}
