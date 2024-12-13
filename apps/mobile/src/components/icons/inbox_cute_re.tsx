import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface InboxCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const InboxCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: InboxCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeWidth={2}
        d="M3 12h4a1.5 1.5 0 0 1 1.5 1.5A1.5 1.5 0 0 0 10 15h4a1.5 1.5 0 0 0 1.5-1.5A1.5 1.5 0 0 1 17 12h4m-.385-1.549-.812-1.42c-1.123-1.967-1.685-2.95-2.617-3.49C16.256 5 15.123 5 12.857 5h-1.714c-2.266 0-3.398 0-4.33.54-.93.54-1.492 1.524-2.616 3.49l-.812 1.421c-.356.622-.533.934-.652 1.266a4 4 0 0 0-.171.644c-.062.348-.062.706-.062 1.423 0 2.539 0 3.809.556 4.75a4 4 0 0 0 1.41 1.41c.941.556 2.211.556 4.75.556h5.568c2.539 0 3.809 0 4.75-.556a4 4 0 0 0 1.41-1.41c.556-.941.556-2.211.556-4.75 0-.717 0-1.075-.062-1.423a4.004 4.004 0 0 0-.17-.644c-.12-.332-.297-.644-.653-1.266Z"
      />
    </Svg>
  )
}
