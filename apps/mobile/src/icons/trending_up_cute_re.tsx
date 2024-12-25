import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface TrendingUpCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const TrendingUpCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: TrendingUpCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path d="M24 0V24H0V0H24Z" fill="white" fillOpacity={0.01} />
      <Path
        d="M3 16L7.25 11.75C8.03001 10.97 8.42002 10.58 8.86852 10.4307C9.27846 10.2943 9.72154 10.2943 10.1315 10.4307C10.58 10.58 10.97 10.97 11.75 11.75V11.75C12.53 12.53 12.92 12.92 13.3685 13.0693C13.7785 13.2057 14.2215 13.2057 14.6315 13.0693C15.08 12.92 15.47 12.53 16.25 11.75L20.5 7.49999M17 6.99999C18.2574 6.47386 19.3841 6.42494 20.6172 6.85324C20.7989 6.91636 20.8898 6.94793 20.9709 7.02905C21.0521 7.11017 21.0836 7.20105 21.1468 7.38279C21.575 8.61587 21.5261 9.74262 21 11"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
