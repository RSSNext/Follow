import { env } from "@env"

export const getProxyUrl = ({
  url,
  width,
  height,
}: {
  url: string
  width: number
  height: number
}) => `${env.VITE_IMGPROXY_URL}/unsafe/${width}x${height}/${encodeURIComponent(url)}`
