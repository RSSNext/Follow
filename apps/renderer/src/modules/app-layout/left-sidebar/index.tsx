import { withResponsiveComponent } from "@follow/components/utils/selector.js"
import { Outlet } from "react-router-dom"

const noop = () =>
  Promise.resolve({
    default: () => null,
  })
export const LeftSidebarLayout = withResponsiveComponent<object>(
  () =>
    import("~/modules/app-layout/left-sidebar/desktop").then((m) => ({
      default: m.MainDestopLayout,
    })),
  () =>
    Promise.resolve({
      default: Outlet,
    }),
)

export const MobileFeedScreen = withResponsiveComponent<object>(noop, () =>
  import("~/modules/app-layout/left-sidebar/mobile").then((m) => ({
    default: m.MainMobileLayout,
  })),
)
