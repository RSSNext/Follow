import * as React from "react"
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const SafariCuteFi = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
    <Path
      fill={props.color}
      fillRule="evenodd"
      d="M11 2.049a9.954 9.954 0 0 0-5.33 2.208l.319.318a1 1 0 0 1-1.415 1.414l-.318-.318a9.954 9.954 0 0 0-2.208 5.328h.45a1 1 0 1 1 0 2h-.45A10.003 10.003 0 0 0 11 21.95v-.45a1 1 0 0 1 2 0v.45a9.954 9.954 0 0 0 5.33-2.208l-.319-.318a1 1 0 1 1 1.415-1.414l.318.318A9.954 9.954 0 0 0 21.95 13h-.45a1 1 0 0 1 0-2h.45A10.003 10.003 0 0 0 13 2.048v.45a1 1 0 1 1-2 0zm4.256 5.303-4.072 2.819a4 4 0 0 0-1.012 1.012l-2.82 4.072c-.633.915.477 2.025 1.392 1.391l4.072-2.819a3.999 3.999 0 0 0 1.012-1.012l2.82-4.072c.633-.915-.477-2.025-1.392-1.391"
      clipRule="evenodd"
    />
  </Svg>
)
