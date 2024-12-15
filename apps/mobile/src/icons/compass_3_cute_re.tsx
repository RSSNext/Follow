import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface Compass3CuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const Compass3CuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: Compass3CuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeWidth={2}
        d="m8.465 8.465 7.07 7.07m-4.007 2.166 1.31-.544c1.505-.626 2.258-.938 2.82-1.5.56-.56.873-1.314 1.499-2.82l.544-1.309c1.58-3.804 2.37-5.706 1.424-6.652-.946-.946-2.849-.156-6.653 1.424l-1.309.543c-1.506.626-2.259.939-2.82 1.5-.561.561-.874 1.314-1.5 2.82l-.543 1.31c-1.58 3.803-2.37 5.706-1.424 6.652.946.945 2.848.155 6.652-1.424Z"
      />
    </Svg>
  )
}
