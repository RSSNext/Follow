export const getProxyUrl = ({
  url,
  width,
  height,
}: {
  url: string
  width: number
  height: number
}) => {
  return `https://img.follow.local/follow/rs:fill:${width}:${height}/plain/${url}`
}
