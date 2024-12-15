import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface CertificateCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const CertificateCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: CertificateCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15.786 9.69c-2.113 1.276-3.715 2.82-4.951 4.951a12.695 12.695 0 0 0-2.475-2.475m-1.714-7.52h1.48a2 2 0 0 0 1.413-.586l1.046-1.046a2 2 0 0 1 2.829 0L14.46 4.06a2 2 0 0 0 1.414.586h1.48a2 2 0 0 1 2 2v1.48a2 2 0 0 0 .585 1.413l1.046 1.046a2 2 0 0 1 0 2.829L19.94 14.46a2 2 0 0 0-.585 1.414v1.48a2 2 0 0 1-2 2h-1.48a2 2 0 0 0-1.414.585l-1.046 1.046a2 2 0 0 1-2.829 0L9.54 19.94a2 2 0 0 0-1.414-.585h-1.48a2 2 0 0 1-2-2v-1.48a2 2 0 0 0-.585-1.414l-1.046-1.046a2 2 0 0 1 0-2.829L4.06 9.54a2 2 0 0 0 .586-1.414v-1.48a2 2 0 0 1 2-2"
      />
    </Svg>
  )
}
