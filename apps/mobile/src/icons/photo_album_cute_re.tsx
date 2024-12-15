import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface PhotoAlbumCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const PhotoAlbumCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: PhotoAlbumCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path fill={color} d="M17 11a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeWidth={2}
        d="m15.857 16.655.354-.354c.666-.666 1-1 1.414-1 .414 0 .747.334 1.414 1L21 18.262m-15 0 4.318-4.318c.667-.667 1-1 1.414-1 .414 0 .748.333 1.414 1l3.473 3.473M18 3.5h-7.5c-3.771 0-5.657 0-6.828 1.172C2.5 5.843 2.5 7.729 2.5 11.5v5.155M17 11a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm-5.5 9.833h4c2.828 0 4.243 0 5.121-.878.879-.879.879-2.293.879-5.122V12.5c0-2.828 0-4.243-.879-5.121C19.743 6.5 18.328 6.5 15.5 6.5h-4c-2.828 0-4.243 0-5.121.879C5.5 8.257 5.5 9.672 5.5 12.5v2.333c0 2.829 0 4.243.879 5.122.878.878 2.293.878 5.121.878Z"
      />
    </Svg>
  )
}
