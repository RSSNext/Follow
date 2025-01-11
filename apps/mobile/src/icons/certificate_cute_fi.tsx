import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface CertificateCuteFiIconProps {
  width?: number
  height?: number
  color?: string
}

export const CertificateCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: CertificateCuteFiIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        fill={color}
        fillRule="evenodd"
        d="M9.843 2.27a3.05 3.05 0 0 1 4.314 0l1.046 1.047a.95.95 0 0 0 .672.278h1.479a3.05 3.05 0 0 1 3.05 3.05v1.48c0 .251.1.493.279.67l1.046 1.047a3.05 3.05 0 0 1 0 4.314l-1.046 1.046a.95.95 0 0 0-.279.672v1.479a3.05 3.05 0 0 1-3.05 3.05h-1.48a.95.95 0 0 0-.67.279l-1.047 1.046a3.05 3.05 0 0 1-4.314 0l-1.046-1.046a.95.95 0 0 0-.671-.278h-1.48a3.05 3.05 0 0 1-3.05-3.051v-1.48a.95.95 0 0 0-.279-.67l-1.046-1.047a3.05 3.05 0 0 1 0-4.314l1.046-1.046a.95.95 0 0 0 .279-.671v-1.48a3.05 3.05 0 0 1 3.05-3.05h1.48a.95.95 0 0 0 .67-.278zm5.4 6.52a1.05 1.05 0 1 1 1.087 1.798c-1.98 1.196-3.448 2.617-4.586 4.58a1.05 1.05 0 0 1-1.746.108 11.643 11.643 0 0 0-2.273-2.273 1.05 1.05 0 1 1 1.27-1.674c.628.476 1.2.99 1.728 1.551 1.209-1.683 2.696-2.988 4.52-4.09"
        clipRule="evenodd"
      />
    </Svg>
  )
}
