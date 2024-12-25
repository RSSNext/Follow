import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface SocialXCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const SocialXCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: SocialXCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        fill={color}
        d="M19.753 4.659a1 1 0 0 0-1.506-1.317zM4.247 19.342a1 1 0 0 0 1.506 1.317zm15.406-.478.772-.635zM18.247 3.342l-5.923 6.769 1.505 1.317 5.924-6.77zm-8.076 9.23-5.924 6.77 1.506 1.317 5.923-6.77zM5.119 4.5h.465v-2H5.12zm2.01.729L18.88 19.5l1.544-1.271L8.672 3.957zM18.88 19.5h-.465v2h.465zm-2.01-.729L5.12 4.5 3.575 5.771l11.753 14.272zm1.545.729a2 2 0 0 1-1.544-.729l-1.544 1.272a4 4 0 0 0 3.088 1.457zm.465 0v2c1.69 0 2.618-1.967 1.544-3.271zM5.584 4.5a2 2 0 0 1 1.544.729l1.544-1.272A4 4 0 0 0 5.584 2.5zm-.465-2c-1.69 0-2.618 1.967-1.544 3.271L5.12 4.5z"
      />
    </Svg>
  )
}
