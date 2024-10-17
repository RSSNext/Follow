import { siteConfig } from "@client/configs"
import { Logo } from "@follow/components/icons/logo.jsx"
import { Button } from "@follow/components/ui/button/index.jsx"
import { Kbd } from "@follow/components/ui/kbd/Kbd.jsx"
import { cn } from "@follow/utils/utils"
import type { MotionValue } from "framer-motion"
import { useMotionValueEvent, useScroll } from "framer-motion"
import * as React from "react"
import { useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { Link } from "react-router-dom"

const useMotionValueToState = (value: MotionValue<number>) => {
  const [state, setState] = useState(value.get())
  useMotionValueEvent(value, "change", (v) => setState(v))
  return state
}

function Container({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("mx-auto max-w-[var(--container-max-width)] px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  )
}

export const Header = () => {
  const { scrollY } = useScroll()
  const scrollYState = useMotionValueToState(scrollY)

  const handleToApp = () => {
    window.open(siteConfig.appUrl, "_blank")
  }
  useHotkeys("l", handleToApp)

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 px-4 py-5 backdrop-blur-lg transition-all lg:px-10",
        scrollYState && "border-b",
      )}
    >
      <Container>
        <nav className="relative flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link className="flex items-center gap-4" to="/">
              <Logo className="h-8 w-auto" />
              <p className="font-default text-xl font-semibold">{APP_NAME}</p>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button
              className="flex size-9 rounded-full border-neutral-300 bg-transparent dark:border-neutral-500 md:w-auto md:px-2"
              variant="outline"
            >
              <a
                href={siteConfig.repoUrl}
                className="flex items-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="i-simple-icons-github size-4" />
                <span className="hidden md:inline">Star on GitHub</span>
              </a>
            </Button>
            <Button
              buttonClassName="hidden lg:block cursor-pointer !text-accent-content"
              onClick={handleToApp}
            >
              Open app
              <Kbd className="kbd-xs !leading-0 ml-2 scale-[0.85] rounded-sm !border-transparent !bg-zinc-200 !font-mono text-black">
                L
              </Kbd>
            </Button>
          </div>
        </nav>
      </Container>
    </header>
  )
}
