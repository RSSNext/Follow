import * as React from "react"
import Svg from "react-native-svg"

interface RoundCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const RoundCuteReIcon = ({ width = 24, height = 24 }: RoundCuteReIconProps) => {
  return <Svg width={width} height={height} fill="none" viewBox="0 0 24 24" />
}
