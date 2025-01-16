import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface SafeLockFilledIconProps {
  width?: number
  height?: number
  color?: string
}

export const SafeLockFilledIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: SafeLockFilledIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        fill={color}
        fillRule="evenodd"
        d="M12.702 2.196a2 2 0 0 0-1.404 0l-7 2.625A2 2 0 0 0 3 6.693v5.363a9 9 0 0 0 4.975 8.05l3.354 1.677a1.5 1.5 0 0 0 1.342 0l3.354-1.677A9 9 0 0 0 21 12.056V6.693a2 2 0 0 0-1.298-1.872zM12 8a2 2 0 0 0-1 3.732V15a1 1 0 1 0 2 0v-3.268A2 2 0 0 0 12 8"
        clipRule="evenodd"
      />
    </Svg>
  )
}
