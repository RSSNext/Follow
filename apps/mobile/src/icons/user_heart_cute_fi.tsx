import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface UserHeartCuteFiIconProps {
  width?: number
  height?: number
  color?: string
}

export const UserHeartCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: UserHeartCuteFiIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        fill={color}
        fillRule="evenodd"
        d="M11 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10m0 11c-2.395 0-4.575.694-6.178 1.672-.8.488-1.484 1.064-1.978 1.69C2.358 16.976 2 17.713 2 18.5c0 .845.411 1.511 1.003 1.986.56.45 1.299.748 2.084.956C6.665 21.859 8.771 22 11 22c.23 0 .46-.002.685-.005a1 1 0 0 0 .89-1.428A5.973 5.973 0 0 1 12 18c0-1.252.383-2.412 1.037-3.373a1 1 0 0 0-.72-1.557c-.43-.046-.87-.07-1.317-.07M18 14.642a2.505 2.505 0 0 0-2.467.027c-.934.526-1.56 1.595-1.532 2.807.035 1.569 1.247 2.797 2.885 3.77.802.477 1.455.46 2.228 0 1.638-.973 2.85-2.201 2.885-3.77.027-1.212-.598-2.28-1.532-2.807A2.505 2.505 0 0 0 18 14.642"
        clipRule="evenodd"
      />
    </Svg>
  )
}
