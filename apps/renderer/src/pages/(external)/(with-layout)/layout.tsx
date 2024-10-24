import { FollowIcon } from "@follow/components/icons/follow.jsx"
import { Logo } from "@follow/components/icons/logo.jsx"
import { cn } from "@follow/utils/utils"
import type { MotionValue } from "framer-motion"
import { useMotionValueEvent, useScroll } from "framer-motion"
import type { FC } from "react"
import { cloneElement, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, Outlet } from "react-router-dom"

import { whoami } from "~/atoms/user"
import { usePresentUserProfileModal } from "~/modules/profile/hooks"
import { UserAvatar } from "~/modules/user/UserAvatar"

const useMotionValueToState = (value: MotionValue<number>) => {
  const [state, setState] = useState(value.get())
  useMotionValueEvent(value, "change", (v) => setState(v))
  return state
}
/** @deprecated */
export function Component() {
  return (
    <>
      <Header />
      <main className="flex h-full grow flex-col pt-[80px]">
        <Outlet />
      </main>
    </>
  )
}

function Header() {
  const present = usePresentUserProfileModal()
  const { t } = useTranslation("external")

  const { scrollY } = useScroll()
  const scrollYState = useMotionValueToState(scrollY)

  return (
    <header className="fixed inset-x-0 top-0 z-[99] px-5 py-2 xl:px-0">
      <div className="relative mx-auto my-4 flex w-full max-w-[1240px] items-center justify-between">
        <div
          className="absolute inset-0 z-0 -mx-3 -my-2 rounded-full bg-slate-50/80 backdrop-blur-lg dark:bg-neutral-900/80 xl:-mx-8"
          style={{
            opacity: scrollYState / 100,
          }}
        />

        <div className="relative z-10 flex w-full items-center justify-between gap-8 px-3">
          <div className="flex grow items-center gap-8">
            <div className="flex items-center gap-2 text-xl font-bold">
              <Logo className="size-8" />
            </div>

            <div className="mx-6 hidden gap-12 text-sm font-medium lg:flex [&>div]:hover:cursor-pointer">
              <HoverableLink
                href="/"
                icon={<FollowIcon className="!size-3" />}
                label={t("header.app")}
              />

              <HoverableLink
                href="https://github.com/RSSNext/follow/releases"
                icon={<i className="i-mgc-download-2-cute-fi" />}
                label={t("header.download")}
              />
            </div>
          </div>
          <button
            className="cursor-pointer"
            type="button"
            onClick={() => {
              present(whoami()?.id)
            }}
          >
            <UserAvatar className="h-10 bg-transparent p-0" hideName />
          </button>
        </div>
      </div>
    </header>
  )
}

const HoverableLink: FC<{
  label: string
  icon: React.JSX.Element
  href: string
  className?: string
}> = ({ icon, label, href, className }) => (
  <Link
    to={href}
    target={href.startsWith("http") ? "_blank" : undefined}
    className={cn("group center flex gap-3 duration-200 hover:text-accent", className)}
  >
    <span className="center">
      {cloneElement(icon, { className: `size-4 ${icon.props.className}` })}
    </span>
    <span className="inline-flex h-[1.5em] flex-col overflow-hidden leading-[1.5em]">
      <span className="inline-flex flex-col gap-2 duration-200 group-hover:translate-y-[calc(-50%-0.25em)]">
        <span>{label}</span>
        <span>{label}</span>
      </span>
    </span>
  </Link>
)
