import { setRoute } from "@renderer/atoms"
import { useLayoutEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"

export const RouterParamsProvider = () => {
  const [searchParams] = useSearchParams()
  const params = useParams()

  useLayoutEffect(() => {
    setRoute({
      params,
      searchParams,
    })
  }, [searchParams, params])
  return null
}
