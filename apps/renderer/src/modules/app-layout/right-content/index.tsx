import { withResponsiveComponent } from "@follow/components/utils/selector.js"

export const RightContentLayout = withResponsiveComponent<object>(
  () =>
    import("~/modules/app-layout/right-content/desktop").then((m) => ({
      default: m.RightContentDesktop,
    })),
  () =>
    import("~/modules/app-layout/right-content/mobile").then((m) => ({
      default: m.RightContentMobile,
    })),
)
