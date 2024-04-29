export const getProxyUrl = ({
  url,
  width,
  height,
}: {
  url: string
  width: number
  height: number
}) => {
  return `https://img.readok.local/readok/rs:fill:${width}:${height}/plain/${url}`
}
