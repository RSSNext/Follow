import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface FolderOpenCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const FolderOpenCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: FolderOpenCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeWidth={2}
        d="M17 20H7c-1.886 0-2.828 0-3.414-.586C3 18.828 3 17.886 3 16V9c0-2.357 0-3.536.732-4.268C4.464 4 5.643 4 8 4h.4c.626 0 .94 0 1.226.088a2 2 0 0 1 .539.26c.248.168.444.413.835.902v0c.391.49.587.734.835.903a2 2 0 0 0 .539.259c.287.088.6.088 1.227.088H17.5c.464 0 .697 0 .892.026a3 3 0 0 1 2.582 2.582C21 9.303 21 9.536 21 10v0M8.381 20h7.155c2.15 0 3.226 0 4.023-.593.797-.593 1.106-1.623 1.724-3.683l.172-.575c.708-2.358 1.061-3.537.462-4.343-.6-.806-1.831-.806-4.293-.806h-7.155c-2.153 0-3.23 0-4.027.594-.797.594-1.105 1.625-1.722 3.687l-.171.573c-.705 2.357-1.057 3.535-.458 4.34.6.806 1.83.806 4.29.806Z"
      />
    </Svg>
  )
}
