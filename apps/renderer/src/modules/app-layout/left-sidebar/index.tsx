import { withResponsiveComponent } from "@follow/components/utils/selector.js"

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
    import("~/modules/app-layout/left-sidebar/index.mobile").then((m) => ({
      default: m.LeftSidebarLayout,
    })),
)

export const MobileFeedScreen = withResponsiveComponent<object>(noop, () =>
  import("~/modules/app-layout/left-sidebar/mobile").then((m) => ({
    default: m.MainMobileLayout,
  })),
)
