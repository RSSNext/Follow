import { Logo } from "@follow/components/icons/logo.js"
import { ActionButton } from "@follow/components/ui/button/index.js"
import { RootPortal } from "@follow/components/ui/portal/index.js"
import { views } from "@follow/constants"
import { IN_ELECTRON } from "@follow/shared/constants"
import { cn } from "@follow/utils/utils"
import useEmblaCarousel from "embla-carousel-react"
import type { FC } from "react"
import { useEffect, useLayoutEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router"

import { useSetSidebarActiveView, useSidebarActiveView } from "~/atoms/sidebar"
import { useLoginModalShow, useWhoami } from "~/atoms/user"
import { PlainModal } from "~/components/ui/modal/stacked/custom-modal"
import { DeclarativeModal } from "~/components/ui/modal/stacked/declarative-modal"
import { getRouteParams } from "~/hooks/biz/useRouteParams"
import { LoginModalContent } from "~/modules/auth/LoginModalContent"

import { FeedList } from "../../feed-column/list"
import { FooterInfo } from "./components/FooterInfo"
import { MobileFloatBar } from "./float-bar.mobile"

export function FeedColumnMobile({ asWidget }: { asWidget?: boolean }) {
  const [active, setActive_] = useSidebarActiveView()

  useLayoutEffect(() => {
    if (asWidget) return
    const { view } = getRouteParams()
    if (view !== undefined) {
      setActive_(view)
    }
  }, [asWidget, setActive_])

  const [feedListScrollRef, setFeedListScrollRef] = useState<HTMLDivElement | null>()

  const isAuthFail = useLoginModalShow()
  const user = useWhoami()

  const { t } = useTranslation()

  return (
    <div
      className={cn(
        "relative flex flex-col space-y-3 bg-background",
        asWidget ? "grow" : "h-screen",
      )}
    >
      <div className="mt-4 flex items-center justify-between pl-6 pr-2">
        <span className="inline-flex items-center gap-3 text-lg font-bold">
          <Logo className="size-8 shrink-0" />
          {APP_NAME}
        </span>
        <div className="center inline-flex">
          <Link to="/discover" tabIndex={-1}>
            <ActionButton shortcut="Meta+T" tooltip={t("words.discover")}>
              <i className="i-mgc-add-cute-re size-5 text-theme-vibrancyFg" />
            </ActionButton>
          </Link>
        </div>
      </div>
      <div className={"relative flex size-full h-0 grow"}>
        <SwipeWrapper active={active}>
          {views.map((item, index) => (
            <section key={item.name} className="size-full flex-none shrink-0 snap-center">
              <FeedList
                ref={setFeedListScrollRef}
                className="flex size-full flex-col text-sm"
                view={index}
              />
            </section>
          ))}
        </SwipeWrapper>
      </div>

      {isAuthFail && !user && (
        <RootPortal>
          <DeclarativeModal
            id="login"
            CustomModalComponent={PlainModal}
            open
            overlay
            title="Login"
            canClose={false}
            clickOutsideToDismiss={false}
          >
            <LoginModalContent canClose={false} runtime={IN_ELECTRON ? "app" : "browser"} />
          </DeclarativeModal>
        </RootPortal>
      )}

      <FooterInfo />
      <MobileFloatBar
        className={asWidget ? "!bottom-0" : undefined}
        scrollContainer={feedListScrollRef}
      />
    </div>
  )
}

const SwipeWrapper: FC<{
  children: React.JSX.Element[]
  active: number
  className?: string
}> = ({ children, active, className }) => {
  const setActive = useSetSidebarActiveView()

  const [initialActive] = useState(active)
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: false,
      startIndex: initialActive,
    },
    [],
  )

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on("select", () => {
      setActive(emblaApi.selectedScrollSnap())
    })
  }, [emblaApi, setActive])

  useEffect(() => {
    if (!emblaApi) return
    const currentSlideIndex = emblaApi.selectedScrollSnap()
    if (currentSlideIndex !== active) {
      emblaApi.scrollTo(active)
    }
  }, [active, emblaApi])

  return (
    <div ref={emblaRef} className={cn("w-full overflow-hidden", className)}>
      <div className="flex size-full">{children}</div>
    </div>
  )
}
