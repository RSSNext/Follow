import * as React from "react"
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const SafariCuteIcon = (
  props: SvgProps & {
    color?: string
  },
) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
    <Path
      stroke={props.color}
      strokeLinecap="round"
      strokeWidth={2}
      d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9h-1.5M12 21a9 9 0 0 1-9-9m9 9v-1.5M3 12a9 9 0 0 1 9-9m-9 9h1.5M12 3v1.5M5.636 5.636l1.06 1.06m10.607 10.607 1.06 1.06"
    />
    <Path
      fill={props.color}
      d="m11.184 10.172 4.072-2.82c.915-.633 2.025.477 1.391 1.392l-2.819 4.072a3.999 3.999 0 0 1-1.012 1.012l-4.072 2.82c-.915.633-2.025-.477-1.392-1.392l2.82-4.072a4.004 4.004 0 0 1 1.012-1.012"
    />
  </Svg>
)
