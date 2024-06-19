import { setNavigate, setRoute } from "@renderer/atoms"
import { useLayoutEffect } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"

export const BizRouterProvider = () => {
  const [searchParams] = useSearchParams()
  const params = useParams()
  const nav = useNavigate()
  useLayoutEffect(() => {
    setRoute({
      params,
      searchParams,
    })
    setNavigate({ fn: nav })
  }, [searchParams, params, nav])
  return null
}
