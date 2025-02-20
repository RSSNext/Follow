import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface Settings1CuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const Settings1CuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: Settings1CuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path
        stroke={color}
        strokeWidth={2}
        d="M7.75 4.637c1.702-.982 2.553-1.473 3.468-1.618a5 5 0 0 1 1.564 0c.915.145 1.766.636 3.468 1.618 1.702.983 2.552 1.474 3.136 2.194a5 5 0 0 1 .782 1.355c.332.865.332 1.848.332 3.813 0 1.964 0 2.947-.332 3.812a5 5 0 0 1-.782 1.355c-.584.72-1.434 1.211-3.136 2.194-1.702.982-2.552 1.474-3.468 1.618a4.999 4.999 0 0 1-1.564 0c-.915-.145-1.766-.636-3.468-1.618-1.702-.983-2.553-1.474-3.136-2.194a5.001 5.001 0 0 1-.782-1.355C3.5 14.946 3.5 13.963 3.5 12c0-1.965 0-2.948.332-3.813a5 5 0 0 1 .782-1.355c.583-.72 1.434-1.211 3.136-2.194z"
      />
      <Path stroke={color} strokeWidth={2} d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </Svg>
  )
}
