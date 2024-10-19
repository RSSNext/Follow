import { m, useMotionTemplate, useMotionValue } from "framer-motion"
import { useCallback, useEffect } from "react"
import { useTranslation } from "react-i18next"

import { useAudioPlayerAtomSelector } from "~/atoms/player"
import { setUpdaterStatus, useUpdaterStatus } from "~/atoms/updater"
import { softBouncePreset } from "~/components/ui/constants/spring"
import { tipcClient } from "~/lib/client"
import { cn } from "~/lib/utils"
import { handlers } from "~/tipc"

export const AutoUpdater = () => {
  const updaterStatus = useUpdaterStatus()
  const { t } = useTranslation()

  useEffect(() => {
    const unlisten = handlers?.updateDownloaded.listen(() => {
      setUpdaterStatus(true)
    })
    return unlisten
  }, [])

  const handleClick = useCallback(() => {
    setUpdaterStatus(false)
    window.analytics?.capture("update_restart")

    tipcClient?.quitAndInstall()
  }, [])

  const playerIsShow = useAudioPlayerAtomSelector((s) => s.show)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const radius = useMotionValue(0)
  const handleMouseMove = useCallback(
    ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
      const bounds = currentTarget.getBoundingClientRect()
      mouseX.set(clientX - bounds.left)
      mouseY.set(clientY - bounds.top)
      radius.set(Math.hypot(bounds.width, bounds.height) * 1.3)
    },
    [mouseX, mouseY, radius],
  )

  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, var(--a) 0%, transparent 65%)`

  if (!updaterStatus) return null

  return (
    <m.div
      onMouseMove={handleMouseMove}
      className={cn(
        "group absolute inset-x-3 bottom-3 cursor-pointer overflow-hidden rounded-lg bg-theme-modal-background py-3 text-center text-sm shadow backdrop-blur",
        playerIsShow && "bottom-28",
      )}
      onClick={handleClick}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={softBouncePreset}
    >
      <m.div
        layout
        className="absolute inset-0 opacity-0 duration-500 group-hover:opacity-5"
        style={
          {
            background,
          } as any
        }
      />
      <div className="font-medium">{t("notify.update_info", { app_name: APP_NAME })}</div>
      <div className="text-xs text-zinc-500">{t("notify.update_info_1")}</div>
    </m.div>
  )
}
