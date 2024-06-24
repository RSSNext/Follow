import { setNavigate, setRoute } from "@renderer/atoms"
import { useLayoutEffect } from "react"
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"
/**
 * Why this.
 * Remix router always update immutable object when the router has any changes, lead to the component which uses router hooks re-render.
 * This provider is hold a empty component, to store the router hooks value.
 * And use our router hooks will not re-render the component when the router has any changes.
 * Also it can access values outside of the component and provide a value selector
 */
export const StableRouterProvider = () => {
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
