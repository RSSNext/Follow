import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface InboxCuteFiIconProps {
  width?: number
  height?: number
  color?: string
}

export const InboxCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: InboxCuteFiIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path
        fill={color}
        fillRule="evenodd"
        d="M11.093 4h1.814c1.09 0 1.982 0 2.714.072.765.076 1.435.237 2.067.603.633.367 1.105.87 1.55 1.497.426.6.868 1.373 1.409 2.32l.836 1.463c.339.593.57.991.726 1.426.093.262.165.53.214.804.096.542.077 1.1.077 1.647 0 1.229 0 2.22-.074 3.018-.076.823-.236 1.542-.62 2.192a5 5 0 0 1-1.764 1.763c-.65.384-1.369.545-2.192.621-.799.074-1.79.074-3.018.074H9.168c-1.229 0-2.22 0-3.018-.074-.823-.076-1.542-.236-2.192-.62a5 5 0 0 1-1.763-1.764c-.384-.65-.545-1.369-.621-2.192-.074-.799-.074-1.79-.074-3.018 0-.548-.019-1.105.078-1.647.048-.273.12-.542.213-.804.155-.435.387-.833.726-1.426l.836-1.463c.541-.947.983-1.72 1.41-2.32.445-.627.916-1.13 1.549-1.497.632-.366 1.302-.527 2.067-.603C9.112 4 10.003 4 11.093 4M8.576 6.063c-.6.06-.962.169-1.26.342-.3.174-.574.433-.923.925-.363.51-.756 1.197-1.328 2.197l-.812 1.42c-.343.602-.475.839-.558 1.053H6.5a3 3 0 0 1 3 3 1 1 0 0 0 1 1h3a1 1 0 0 0 1-1 3 3 0 0 1 3-3h2.805c-.083-.214-.215-.451-.558-1.053l-.812-1.42c-.572-1-.965-1.687-1.327-2.197-.35-.492-.625-.751-.924-.925-.298-.173-.66-.283-1.26-.342C14.802 6 14.01 6 12.858 6h-1.715c-1.153 0-1.945.001-2.567.063"
        clipRule="evenodd"
      />
    </Svg>
  )
}
