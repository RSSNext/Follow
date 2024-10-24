import { Logo } from "@follow/components/icons/logo.jsx"
import { cn } from "@follow/utils/utils"
import pkg from "@pkg"

export const PoweredByFooter: Component = ({ className }) => (
  <footer className={cn("center mt-12 flex gap-2", className)}>
    Powered by <Logo className="size-5" />{" "}
    <a
      href={pkg.homepage}
      className="cursor-pointer font-bold text-accent no-underline"
      target="_blank"
      rel="noreferrer"
    >
      {APP_NAME}
    </a>
  </footer>
)
