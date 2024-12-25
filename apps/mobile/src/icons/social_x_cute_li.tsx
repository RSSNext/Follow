import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface SocialXCuteLiIconProps {
  width?: number
  height?: number
  color?: string
}

export const SocialXCuteLiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: SocialXCuteLiIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        fill={color}
        d="M19.564 4.494a.75.75 0 1 0-1.128-.988zM4.436 19.506a.75.75 0 0 0 1.128.988zm15.217-.642.579-.477zM18.436 3.506l-5.924 6.77 1.13.987 5.922-6.77zm-8.077 9.23-5.923 6.77 1.128.988 5.924-6.77zM5.119 4.25h.465v-1.5H5.12zm2.202.82L19.074 19.34l1.158-.954L8.479 4.118zm11.56 14.68h-.465v1.5h.465zm-2.202-.82L4.926 4.66l-1.158.953 11.753 14.272zm1.737.82c-.673 0-1.31-.3-1.737-.82l-1.158.954a3.75 3.75 0 0 0 2.895 1.366zm.658-.409a.25.25 0 0 1-.193.409v1.5c1.479 0 2.291-1.72 1.35-2.863zM5.584 4.25c.673 0 1.31.3 1.737.82l1.158-.954A3.75 3.75 0 0 0 5.584 2.75zm-.465-1.5c-1.479 0-2.291 1.72-1.35 2.862l1.157-.953a.25.25 0 0 1 .193-.409z"
      />
    </Svg>
  )
}
