import { setNavigate, setRoute } from "@renderer/atoms"
import { useSettingModal } from "@renderer/modules/settings/modal/hooks"
import { useLayoutEffect } from "react"
import type { NavigateFunction } from "react-router-dom"
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom"

declare global {
  export const router: {
    navigate: NavigateFunction
    showSettings: (initialTab?: string | undefined) => () => void
  }
  interface Window {
    router: typeof router
  }
}
window.router = {
  navigate() {},
  // eslint-disable-next-line unicorn/consistent-function-scoping
  showSettings: () => () => {},
}

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

  const showSettings = useSettingModal()

  // NOTE: This is a hack to expose the navigate function to the window object, avoid to import `router` circular issue.
  useLayoutEffect(() => {
    window.router.navigate = nav
    window.router.showSettings = showSettings
    setRoute({
      params,
      searchParams,
      location,
    })
    setNavigate({ fn: nav })
  }, [searchParams, params, location, nav, showSettings])
  return null
}
