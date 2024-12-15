import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface DocmentCuteFiIconProps {
  width?: number
  height?: number
  color?: string
}

export const DocmentCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: DocmentCuteFiIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        fill={color}
        fillRule="evenodd"
        d="M12 1.5c1.315 0 2.646-.034 3.954.12 1.137.135 2.217.497 3.046 1.31.855.837 1.24 1.942 1.38 3.116.12 1.02.12 2.301.12 3.89v4.128c0 1.59 0 2.871-.12 3.89-.14 1.174-.525 2.28-1.38 3.117-.829.812-1.909 1.174-3.046 1.309-1.308.155-2.64.12-3.954.12-1.315 0-2.646.035-3.954-.12-1.137-.134-2.217-.497-3.046-1.309-.855-.838-1.24-1.943-1.38-3.117-.12-1.019-.12-2.3-.12-3.89V9.937c0-1.59 0-2.872.12-3.89.14-1.175.525-2.28 1.38-3.117.829-.813 1.909-1.175 3.046-1.31 1.308-.154 2.64-.12 3.954-.12M8 9a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1m0 5a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1"
        clipRule="evenodd"
      />
    </Svg>
  )
}
