import { useViewport } from "./useViewport"

export const useMobile = () => {
  return useViewport((v) => v.w < 1024 && v.w !== 0)
}
