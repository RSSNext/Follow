import { Logo } from "@follow/components/icons/logo.jsx"
import { cn } from "@follow/utils/utils"
import pkg from "@pkg"

export const PoweredByFooter: Component = ({ className }) => (
  <footer className={cn("center mt-12 flex gap-2", className)}>
    {new Date().getFullYear()}
    <Logo className="size-5" />{" "}
    <a
      href={pkg.homepage}
      className="text-accent cursor-pointer font-bold no-underline"
      target="_blank"
      rel="noreferrer"
    >
      {APP_NAME}
    </a>
  </footer>
)
