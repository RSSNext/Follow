import { useMobile } from "@follow/components/hooks/useMobile.js"
import type { ComponentType, ReactNode } from "react"
import { lazy, Suspense } from "react"

export function withResponsiveComponent<P extends object>(
  desktopImport: () => Promise<{ default: ComponentType<P> }>,
  mobileImport: () => Promise<{ default: ComponentType<P> }>,

  fallbackElement?: ReactNode,
) {
  const LazyDesktopLayout = lazy(desktopImport) as unknown as ComponentType<P>
  const LazyMobileLayout = lazy(mobileImport) as unknown as ComponentType<P>

  return function ResponsiveLayout(props: P) {
    const isMobile = useMobile()
    return (
      <Suspense fallback={fallbackElement}>
        {isMobile ? <LazyMobileLayout {...props} /> : <LazyDesktopLayout {...props} />}
      </Suspense>
    )
  }
}
export function withResponsiveSyncComponent<P extends object>(
  DesktopComponent: ComponentType<P>,
  MobileComponent: ComponentType<P>,
) {
  return function ResponsiveLayout(props: P) {
    const isMobile = useMobile()
    return isMobile ? <MobileComponent {...props} /> : <DesktopComponent {...props} />
  }
}
