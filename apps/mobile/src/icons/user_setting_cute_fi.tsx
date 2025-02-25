import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface UserSettingCuteFiIconProps {
  width?: number
  height?: number
  color?: string
}

export const UserSettingCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: UserSettingCuteFiIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M11 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10M11 13c-2.395 0-4.575.694-6.178 1.672-.8.488-1.484 1.064-1.978 1.69C2.358 16.976 2 17.713 2 18.5c0 .845.411 1.511 1.003 1.986.56.45 1.299.748 2.084.956C6.665 21.859 8.771 22 11 22c.23 0 .46-.002.685-.005a1 1 0 0 0 .89-1.428A5.973 5.973 0 0 1 12 18c0-1.252.383-2.412 1.037-3.373a1 1 0 0 0-.72-1.557c-.43-.046-.87-.07-1.317-.07M20.616 15.469a1 1 0 1 0-1.732-1l-.336.582a2.995 2.995 0 0 0-1.097-.001l-.335-.581a1 1 0 1 0-1.732 1l.335.58a2.997 2.997 0 0 0-.547.951H14.5a1 1 0 0 0 0 2h.671a3.021 3.021 0 0 0 .549.95l-.336.581a1 1 0 1 0 1.732 1l.336-.581c.359.066.73.068 1.097 0l.335.581a1 1 0 1 0 1.732-1l-.335-.58c.242-.284.426-.607.547-.951h.672a1 1 0 1 0 0-2h-.671a3.029 3.029 0 0 0-.549-.95z"
      />
    </Svg>
  )
}
