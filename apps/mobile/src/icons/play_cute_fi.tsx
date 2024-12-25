import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface PlayCuteFiIconProps {
  width?: number
  height?: number
  color?: string
}

export const PlayCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: PlayCuteFiIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        fill={color}
        fillRule="evenodd"
        d="M4.61 6.49c.243-1.11.747-2 1.784-2.6 1.037-.598 2.06-.59 3.143-.244.981.312 2.11.935 3.442 1.67.989.546 1.966 1.111 2.933 1.694 1.3.784 2.4 1.449 3.16 2.142.838.764 1.356 1.646 1.356 2.842 0 1.197-.519 2.079-1.357 2.842-.76.693-1.861 1.356-3.16 2.14a90.42 90.42 0 0 1-2.954 1.704c-1.324.732-2.447 1.352-3.425 1.663-1.08.343-2.1.35-3.136-.248s-1.541-1.485-1.784-2.591c-.22-1.003-.246-2.285-.275-3.797a88.093 88.093 0 0 1 0-3.403c.029-1.52.053-2.809.273-3.815"
        clipRule="evenodd"
      />
    </Svg>
  )
}
