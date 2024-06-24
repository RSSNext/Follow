import { setNavigate, setRoute } from "@renderer/atoms"
import { useLayoutEffect } from "react"
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"

export const BizRouterProvider = () => {
  const [searchParams] = useSearchParams()
  const params = useParams()
  const nav = useNavigate()
  const location = useLocation()
  useLayoutEffect(() => {
    setRoute({
      params,
      searchParams,
      location,
    })
    setNavigate({ fn: nav })
  }, [searchParams, params, location, nav])
  return null
}
