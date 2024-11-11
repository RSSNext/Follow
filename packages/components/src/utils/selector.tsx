import { useMobile } from "@follow/components/hooks/useMobile.js"
import type { ComponentType } from "react"
import { lazy, Suspense } from "react"

export function withResponsiveComponent<P extends object>(
  desktopImport: () => Promise<{ default: ComponentType<P> }>,
  mobileImport: () => Promise<{ default: ComponentType<P> }>,
) {
  const LazyDesktopLayout = lazy(desktopImport) as unknown as ComponentType<P>
  const LazyMobileLayout = lazy(mobileImport) as unknown as ComponentType<P>

  return function ResponsiveLayout(props: P) {
    const isMobile = useMobile()
    return (
      <Suspense>
        {isMobile ? <LazyMobileLayout {...props} /> : <LazyDesktopLayout {...props} />}
      </Suspense>
    )
  }
}
