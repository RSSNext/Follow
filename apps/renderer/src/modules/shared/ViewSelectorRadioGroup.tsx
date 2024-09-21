import { forwardRef } from "react"

import { Card, CardHeader } from "~/components/ui/card"
import { views } from "~/constants"
import { useI18n } from "~/hooks/common"
import { cn } from "~/lib/utils"

export const ViewSelectorRadioGroup = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...rest }, ref) => {
  const t = useI18n()

  return (
    <Card>
      <CardHeader className={cn("grid grid-cols-6 space-y-0 px-2 py-3", className)}>
        {views.map((view) => (
          <div key={view.name}>
            <input
              className="peer hidden"
              type="radio"
              id={view.name}
              value={view.view}
              ref={ref}
              {...rest}
            />
            <label
              htmlFor={view.name}
              className={cn(
                "hover:text-theme-foreground dark:hover:text-white",
                view.peerClassName,
                "center flex h-10 flex-col text-xs leading-none opacity-80 duration-200",
                "text-neutral-800 dark:text-zinc-200",
                "peer-checked:opacity-100",
                "whitespace-nowrap",
              )}
            >
              <span className="text-lg">{view.icon}</span>
              {t(view.name)}
            </label>
          </div>
        ))}
      </CardHeader>
    </Card>
  )
})
