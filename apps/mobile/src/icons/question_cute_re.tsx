import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface QuestionCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const QuestionCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: QuestionCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        fill={color}
        d="M12 16a1 1 0 1 0 0 2zm.002 2a1 1 0 0 0 0-2zm-3.627-7.875a1 1 0 1 0 2 0zM11 14a1 1 0 1 0 2 0zm1.976-1.437.372.928zM20 12a8 8 0 0 1-8 8v2c5.523 0 10-4.477 10-10zm-8 8a8 8 0 0 1-8-8H2c0 5.523 4.477 10 10 10zm-8-8a8 8 0 0 1 8-8V2C6.477 2 2 6.477 2 12zm8-8a8 8 0 0 1 8 8h2c0-5.523-4.477-10-10-10zm0 14h.002v-2H12zm1.625-7.875c0 .682-.42 1.269-1.02 1.51l.743 1.856a3.626 3.626 0 0 0 2.277-3.366zm-3.25 0c0-.897.727-1.625 1.625-1.625v-2a3.625 3.625 0 0 0-3.625 3.625zM12 8.5c.898 0 1.625.728 1.625 1.625h2A3.625 3.625 0 0 0 12 6.5zm-1 5.25V14h2v-.25zm1.604-2.116c-.675.27-1.604.963-1.604 2.116h2c0 .02-.012.003.043-.059a.837.837 0 0 1 .305-.2z"
      />
    </Svg>
  )
}
