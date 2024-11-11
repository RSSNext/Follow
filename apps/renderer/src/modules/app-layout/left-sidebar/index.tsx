import { withResponsiveComponent } from "@follow/components/utils/selector.js"

export const LeftSidebarLayout = withResponsiveComponent<never>(
  () =>
    import("~/modules/app-layout/left-sidebar/desktop").then((m) => ({
      default: m.MainDestopLayout,
    })),
  () =>
    import("~/modules/app-layout/left-sidebar/mobile").then((m) => ({
      default: m.MainMobileLayout,
    })),
)
