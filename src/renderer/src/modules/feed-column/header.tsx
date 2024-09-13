import { setAppSearchOpen } from "@renderer/atoms/app"
import { useGeneralSettingKey } from "@renderer/atoms/settings/general"
import { setFeedColumnShow, useFeedColumnShow, useSidebarActiveView } from "@renderer/atoms/sidebar"
import { Logo } from "@renderer/components/icons/logo"
import { ActionButton } from "@renderer/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@renderer/components/ui/popover"
import { ProfileButton } from "@renderer/components/user-button"
import { useNavigateEntry } from "@renderer/hooks/biz/useNavigateEntry"
import { stopPropagation } from "@renderer/lib/dom"
import { cn } from "@renderer/lib/utils"
import { m } from "framer-motion"
import type { FC, PropsWithChildren } from "react"
import { memo, useCallback, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { toast } from "sonner"

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
  const { t } = useTranslation()
  const navigateBackHome = useBackHome(active)
  const normalStyle = !window.electron || window.electron.process.platform !== "darwin"
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
      <div className="relative flex items-center gap-1" onClick={stopPropagation}>
        <SearchActionButton />

        <Link to="/discover" tabIndex={-1}>
          <ActionButton shortcut="Meta+T" tooltip={t("words.add")}>
            <i className="i-mgc-add-cute-re size-5 text-theme-vibrancyFg" />
          </ActionButton>
        </Link>
        <ProfileButton method="modal" />
        <LayoutActionButton />
      </div>
    </div>
  )
})

const LayoutActionButton = () => {
  const feedColumnShow = useFeedColumnShow()

  const [animation] = useState({
    width: !feedColumnShow ? "auto" : 0,
  })

  return (
    <m.div initial={animation} animate={animation} className="overflow-hidden">
      <ActionButton
        tooltip="Toggle Sidebar"
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
            toast.success("Copied to clipboard")
          }}
          className={cn(
            "relative flex cursor-default select-none items-center rounded-sm px-1 py-0.5 text-sm outline-none",
            "focus-within:outline-transparent hover:bg-theme-item-hover dark:hover:bg-neutral-800",
            "gap-2 text-foreground/80 [&_svg]:size-3",
          )}
        >
          <Logo ref={logoRef} />
          <span>Copy Logo SVG</span>
        </button>
      </PopoverContent>
    </Popover>
  )
}

const SearchActionButton = () => {
  const canSearch = useGeneralSettingKey("dataPersist")
  const { t } = useTranslation()
  if (!canSearch) return null
  return (
    <ActionButton
      shortcut="Meta+K"
      tooltip={t("words.search")}
      onClick={() => setAppSearchOpen(true)}
    >
      <i className="i-mgc-search-2-cute-re size-5 text-theme-vibrancyFg" />
    </ActionButton>
  )
}
