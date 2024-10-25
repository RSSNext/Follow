import { Tooltip, TooltipContent, TooltipTrigger } from "@follow/components/ui/tooltip/index.js"
import { useTranslation } from "react-i18next"

export const FixedModalCloseButton: Component<{
  onClick: () => void
}> = ({ onClick }) => {
  const { t } = useTranslation("common")
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="center flex size-8 rounded-full bg-background p-1 shadow-sm ring-1 ring-zinc-200 dark:ring-neutral-800"
          onClick={onClick}
        >
          <i className="i-mgc-close-cute-re text-lg" />
          <span className="sr-only">{t("close")}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent>{t("close")}</TooltipContent>
    </Tooltip>
  )
}
