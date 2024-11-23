import { cn } from "@follow/utils/utils"
import { easeOut, m, useScroll, useTransform } from "framer-motion"
import { Outlet } from "react-router-dom"

import { HeaderTopReturnBackButton } from "~/components/mobile/button"

import { useSubViewTitleValue } from "./hooks"

export const SubviewLayout = () => {
  const title = useSubViewTitleValue()

  const scrollYProgress = useScroll()

  const opacity = useTransform(scrollYProgress.scrollY, [0, 120], [0, 1], { ease: easeOut })
  const borderOpacity = useTransform(scrollYProgress.scrollY, [50, 120], [0, 1], { ease: easeOut })

  return (
    <>
      <HeaderTopReturnBackButton className="fixed z-[11] m-3" />

      <m.div
        className={cn(
          "sticky inset-x-0 top-0 z-10 p-4",
          "grid grid-cols-[1fr_auto_1fr] items-center gap-4",
          "bg-zinc-50/80 backdrop-blur-xl dark:bg-neutral-900/90",
          "border-b",
        )}
        style={{
          opacity,
          borderColor: useTransform(borderOpacity, (value) => `hsl(var(--border) / ${value})`),
        }}
      >
        <div />
        <div>
          <div className="font-bold">{title}</div>
        </div>
        <div />
      </m.div>

      <Outlet />
    </>
  )
}
