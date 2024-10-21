import { cn } from "@follow/utils/utils"
import pkg from "@pkg"

import { Logo } from "../icons/logo"

export const PoweredByFooter: Component = ({ className }) => (
  <footer className={cn("center mt-12 flex gap-2 pb-5", className)}>
    <span className="text-xs opacity-80">{new Date().getFullYear()}</span>{" "}
    <Logo className="size-5" />{" "}
    <a
      href={pkg.homepage}
      className="cursor-pointer font-default font-bold text-accent no-underline"
      target="_blank"
      rel="noreferrer"
    >
      {APP_NAME}
    </a>
  </footer>
)
