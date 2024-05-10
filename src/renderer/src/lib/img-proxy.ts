export const getProxyUrl = ({
  url,
  width,
  height,
}: {
  url: string
  width: number
  height: number
}) => {
  return `${import.meta.env.VITE_IMGPROXY_URL}/follow/rs:fill:${width}:${height}/plain/${url}`
}
