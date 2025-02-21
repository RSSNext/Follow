import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface StopCircleCuteFiIconProps {
  width?: number
  height?: number
  color?: string
}

export const StopCircleCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: StopCircleCuteFiIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path
        fill={color}
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2m.049 5.5h-.098c-.66 0-1.23 0-1.695.047-.494.05-.979.162-1.423.459a3 3 0 0 0-.827.827c-.297.444-.409.93-.459 1.423C7.5 10.72 7.5 11.29 7.5 11.95v.098c0 .66 0 1.23.047 1.695.05.494.162.979.459 1.423a3 3 0 0 0 .827.827c.444.297.93.409 1.423.459.497.05.998.049 1.498.047a67.332 67.332 0 0 1 .492 0c.5.002 1.001.003 1.498-.047.494-.05.979-.162 1.423-.459a3 3 0 0 0 .827-.827c.297-.444.409-.93.459-1.423.05-.497.049-.998.047-1.498a67.332 67.332 0 0 1 0-.492c.002-.5.003-1.001-.047-1.498-.05-.494-.162-.979-.459-1.423a3 3 0 0 0-.827-.827c-.444-.297-.93-.409-1.423-.459C13.28 7.5 12.71 7.5 12.05 7.5"
        clipRule="evenodd"
      />
    </Svg>
  )
}
