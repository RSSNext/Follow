import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface TrainCuteFiIconProps {
  width?: number
  height?: number
  color?: string
}

export const TrainCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: TrainCuteFiIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path
        fill={color}
        fillRule="evenodd"
        d="M6.453 5H12c3.22 0 6.05 1.072 8.091 2.569C22.083 9.029 23.5 11.04 23.5 13c0 .842-.258 1.56-.713 2.14-.444.566-1.034.95-1.636 1.214-1.186.518-2.597.646-3.651.646H6.45c-1.285 0-2.792.133-3.951-.536A4 4 0 0 1 1.036 15C.357 13.825.5 12.303.5 11s-.143-2.825.536-4A4 4 0 0 1 2.5 5.536c.525-.304 1.096-.425 1.72-.482C4.82 5 5.558 5 6.453 5M7 10H2.503c.005-.444.016-.799.043-1.1.096-1.057.755-1.754 1.854-1.854C5.262 6.968 6.134 7 7 7zm2 0h4V7.04c-.328-.026-.661-.04-1-.04H9zm6-2.63V10h4.88a9.136 9.136 0 0 0-.971-.819c-1.059-.776-2.39-1.427-3.91-1.81M.5 19a1 1 0 0 1 1-1h20a1 1 0 1 1 0 2h-20a1 1 0 0 1-1-1"
        clipRule="evenodd"
      />
    </Svg>
  )
}
