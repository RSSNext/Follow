import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface Settings1CuteFiIconProps {
  width?: number
  height?: number
  color?: string
}

export const Settings1CuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: Settings1CuteFiIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        fill={color}
        fillRule="evenodd"
        d="M12.949 1.97c-.629-.1-1.269-.1-1.897 0-1.113.175-2.126.76-3.652 1.643a689.84 689.84 0 0 1-.362.208c-1.527.881-2.54 1.466-3.25 2.341-.4.495-.72 1.05-.948 1.643-.403 1.052-.403 2.222-.402 3.985a476.236 476.236 0 0 1 0 .417c-.001 1.763-.001 2.933.402 3.985.228.594.548 1.148.949 1.642.709.876 1.722 1.46 3.25 2.342l.18.104.18.104c1.527.882 2.54 1.468 3.653 1.644.628.1 1.268.1 1.896 0 1.113-.176 2.126-.762 3.653-1.644l.18-.104.18-.104c1.528-.881 2.542-1.466 3.25-2.341.4-.495.72-1.05.949-1.643.404-1.052.403-2.222.403-3.985v-.417c0-1.763 0-2.933-.403-3.985a6.062 6.062 0 0 0-.948-1.642c-.71-.876-1.723-1.46-3.25-2.342l-.18-.104-.181-.104c-1.527-.882-2.54-1.468-3.652-1.644M9 12a3 3 0 1 1 6 0 3 3 0 0 1-6 0"
        clipRule="evenodd"
      />
    </Svg>
  )
}
