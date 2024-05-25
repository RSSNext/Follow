export const getProxyUrl = ({
  url,
  width,
  height,
}: {
  url: string
  width: number
  height: number
}) => `${import.meta.env.VITE_IMGPROXY_URL}/unsafe/${width}x${height}/${encodeURIComponent(url)}`
