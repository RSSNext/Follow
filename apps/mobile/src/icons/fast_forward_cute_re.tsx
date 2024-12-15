import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface FastForwardCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const FastForwardCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: FastForwardCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11.498 10.656c.047-2.233.07-3.35 1.08-3.906 1.009-.557 1.958.014 3.856 1.155a53.241 53.241 0 0 1 2.142 1.357c1.661 1.11 2.492 1.665 2.491 2.735 0 1.07-.83 1.623-2.492 2.73a54.673 54.673 0 0 1-2.157 1.367c-1.887 1.135-2.83 1.703-3.84 1.146-1.008-.557-1.032-1.667-1.08-3.887a63.588 63.588 0 0 1 0-2.697ZM2.498 10.656c.047-2.233.07-3.35 1.08-3.906 1.009-.557 1.958.014 3.856 1.155.26.157.529.32.804.493 1.845 1.154 2.767 1.73 3.03 2.98.071.343.071.89 0 1.233-.263 1.25-1.186 1.827-3.03 2.98-.282.177-.555.344-.82.503-1.887 1.135-2.83 1.703-3.84 1.146-1.008-.557-1.032-1.667-1.08-3.887a63.725 63.725 0 0 1 0-2.697Z"
      />
    </Svg>
  )
}
