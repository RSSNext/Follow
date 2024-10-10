import { m } from "framer-motion"
import type { FC, PropsWithChildren } from "react"
import { memo, useCallback, useEffect, useRef, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { toast } from "sonner"

import { setAppSearchOpen } from "~/atoms/app"
import { useGeneralSettingKey } from "~/atoms/settings/general"
import { setFeedColumnShow, useFeedColumnShow, useSidebarActiveView } from "~/atoms/sidebar"
import { Logo } from "~/components/icons/logo"
import { ActionButton } from "~/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { ProfileButton } from "~/components/user-button"
import { useNavigateEntry } from "~/hooks/biz/useNavigateEntry"
import { useI18n } from "~/hooks/common"
import { stopPropagation } from "~/lib/dom"
import { cn } from "~/lib/utils"

const useBackHome = (active: number) => {
  const navigate = useNavigateEntry()

  return useCallback(
    (overvideActive?: number) => {
      navigate({
        feedId: null,
        entryId: null,
        view: overvideActive ?? active,
      })
    },
    [active, navigate],
  )
}

export const FeedColumnHeader = memo(() => {
  const [active] = useSidebarActiveView()
  const navigateBackHome = useBackHome(active)
  const normalStyle = !window.electron || window.electron.process.platform !== "darwin"
  const { t } = useTranslation()
  return (
    <div
      className={cn(
        "ml-5 mr-3 flex items-center",

        normalStyle ? "ml-4 justify-between" : "justify-end",
      )}
    >
      {normalStyle && (
        <LogoContextMenu>
          <div
            className="relative flex items-center gap-1 font-default text-lg font-semibold"
            onClick={(e) => {
              e.stopPropagation()
              navigateBackHome()
            }}
          >
            <Logo className="mr-1 size-6" />
            {APP_NAME}
          </div>
        </LogoContextMenu>
      )}
      <div className="relative flex items-center gap-2" onClick={stopPropagation}>
        <Link to="/discover" tabIndex={-1}>
          <ActionButton shortcut="Meta+T" tooltip={t("words.discover")}>
            <i className="i-mgc-add-cute-re size-5 text-theme-vibrancyFg" />
          </ActionButton>
        </Link>
        <SearchTrigger />

        <ProfileButton method="modal" />
        <LayoutActionButton />
      </div>
    </div>
  )
})

const LayoutActionButton = () => {
  const feedColumnShow = useFeedColumnShow()

  const [animation, setAnimation] = useState({
    width: !feedColumnShow ? "auto" : 0,
  })

  useEffect(() => {
    setAnimation({
      width: !feedColumnShow ? "auto" : 0,
    })
  }, [feedColumnShow])

  const t = useI18n()

  if (feedColumnShow) return null

  return (
    <m.div initial={animation} animate={animation} className="overflow-hidden">
      <ActionButton
        tooltip={t("app.toggle_sidebar")}
        icon={
          <i
            className={cn(
              !feedColumnShow
                ? "i-mgc-layout-leftbar-open-cute-re "
                : "i-mgc-layout-leftbar-close-cute-re",
              "text-theme-vibrancyFg",
            )}
          />
        }
        onClick={() => setFeedColumnShow(!feedColumnShow)}
      />
    </m.div>
  )
}

const LogoContextMenu: FC<PropsWithChildren> = ({ children }) => {
  const [open, setOpen] = useState(false)
  const logoRef = useRef<SVGSVGElement>(null)
  const t = useI18n()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        onContextMenu={() => {
          setOpen(true)
        }}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent align="start" className="!p-1">
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(logoRef.current?.outerHTML || "")
            setOpen(false)
            toast.success(t.common("app.copied_to_clipboard"))
          }}
          className={cn(
            "relative flex cursor-menu select-none items-center rounded-sm px-1 py-0.5 text-sm outline-none",
            "focus-within:outline-transparent hover:bg-theme-item-hover dark:hover:bg-neutral-800",
            "gap-2 text-foreground/80 [&_svg]:size-3",
          )}
        >
          <Logo ref={logoRef} />
          <span>{t("app.copy_logo_svg")}</span>
        </button>
      </PopoverContent>
    </Popover>
  )
}

// const SearchActionButton = () => {
//   const canSearch = useGeneralSettingKey("dataPersist")
//   const { t } = useTranslation()
//   if (!canSearch) return null
//   return (
//     <ActionButton
//       shortcut="Meta+K"
//       tooltip={t("words.search")}
//       onClick={() => setAppSearchOpen(true)}
//     >
//       <i className="i-mgc-search-2-cute-re size-5 text-theme-vibrancyFg" />
//     </ActionButton>
//   )
// }

const SearchTrigger = () => {
  const canSearch = useGeneralSettingKey("dataPersist")

  useHotkeys(
    "meta+k,ctrl+k",
    () => {
      setAppSearchOpen(true)
    },
    {
      enabled: canSearch,
    },
  )

  return null
}
