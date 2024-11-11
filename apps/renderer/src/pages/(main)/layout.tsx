import { useMobile } from "@follow/components/hooks/useMobile.js"
import { lazy, Suspense } from "react"

const LazyDesktopLayout = lazy(() =>
  import("~/modules/app-layout/desktop").then((m) => ({
    default: m.MainDestopLayout,
  })),
)
const LazyMobileLayout = lazy(() =>
  import("~/modules/app-layout/mobile").then((m) => ({
    default: m.MainMobileLayout,
  })),
)

export const Component = () => {
  const isMobile = useMobile()
  return <Suspense>{isMobile ? <LazyMobileLayout /> : <LazyDesktopLayout />}</Suspense>
}
