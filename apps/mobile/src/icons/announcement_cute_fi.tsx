import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface AnnouncementCuteFiIconProps {
  width?: number
  height?: number
  color?: string
}

export const AnnouncementCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: AnnouncementCuteFiIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        fill={color}
        fillRule="evenodd"
        d="M16.895 1.822c.79-.158 1.62.187 2.063.86.285.431.33.962.4 1.46.183 1.326.314 2.641.393 3.952a3.001 3.001 0 0 1 0 5.811 50.66 50.66 0 0 1-.379 3.845c-.056.416-.095.852-.3 1.227a2.017 2.017 0 0 1-2.492.9c-.396-.158-.709-.472-1.018-.756-.466-.427-.924-.869-1.407-1.277A11 11 0 0 0 10 15.645v2.645a2.71 2.71 0 0 1-5.316.744l-1.57-5.497a4.7 4.7 0 0 1 3.326-7.73c.855-.047 1.719-.063 2.57-.165a11 11 0 0 0 4.727-1.723c.636-.416 1.232-.896 1.84-1.352.4-.3.814-.643 1.318-.745M5.634 15.078l.973 3.407A.71.71 0 0 0 8 18.29v-3.006c-.786-.065-1.595-.027-2.366-.206m14.2-3.527a.996.996 0 0 0 0-1.103c.005.368.005.736 0 1.103"
        clipRule="evenodd"
      />
    </Svg>
  )
}
