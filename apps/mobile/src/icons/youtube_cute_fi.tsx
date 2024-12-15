import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface YoutubeCuteFiIconProps {
  width?: number
  height?: number
  color?: string
}

export const YoutubeCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: YoutubeCuteFiIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        fill={color}
        fillRule="evenodd"
        d="M12 4.25c-2.214 0-4.571.151-6.248.287a3.552 3.552 0 0 0-3.266 3.198C2.366 8.97 2.25 10.537 2.25 12c0 1.463.116 3.03.236 4.265a3.552 3.552 0 0 0 3.266 3.198c1.677.136 4.034.287 6.248.287 2.214 0 4.571-.151 6.248-.287a3.552 3.552 0 0 0 3.267-3.198c.12-1.234.235-2.802.235-4.265 0-1.463-.116-3.03-.235-4.265a3.552 3.552 0 0 0-3.267-3.198C16.571 4.401 14.214 4.25 12 4.25m-1.802 4.875c.482-.278.957-.023 1.908.486a31.144 31.144 0 0 1 1.694.978c.911.566 1.367.85 1.367 1.406 0 .557-.456.839-1.368 1.404a31.942 31.942 0 0 1-1.697.98c-.947.508-1.421.763-1.904.485-.482-.278-.499-.816-.533-1.892a31.058 31.058 0 0 1 0-1.951c.034-1.078.051-1.618.533-1.896"
        clipRule="evenodd"
      />
    </Svg>
  )
}
