import { PopoverPortal } from "@radix-ui/react-popover"
import {
  ActionButton,
  Button,
  IconButton,
} from "@renderer/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@renderer/components/ui/popover"
import { shortcuts } from "@renderer/constants/shortcuts"
import { cn } from "@renderer/lib/utils"
import { AnimatePresence, m } from "framer-motion"
import type { FC, ReactNode } from "react"
import { forwardRef, useState } from "react"

import type { MarkAllFilter } from "../hooks/useMarkAll"
import { useMarkAllByRoute } from "../hooks/useMarkAll"

interface MarkAllButtonProps {
  filter?: MarkAllFilter
  className?: string
  which?: ReactNode

  shortcut?: boolean
}
export const MarkAllReadButton = forwardRef<
  HTMLButtonElement,
  MarkAllButtonProps
>(({ filter, className, which = "all", shortcut }, ref) => {
  const [markPopoverOpen, setMarkPopoverOpen] = useState(false)

  const handleMarkAllAsRead = useMarkAllByRoute(filter)

  return (
    <Popover open={markPopoverOpen} onOpenChange={setMarkPopoverOpen}>
      <PopoverTrigger asChild>
        <ActionButton
          shortcut={shortcut ? shortcuts.entries.markAllAsRead.key : undefined}
          tooltip={(
            <span>
              Mark
              <span> </span>
              {which}
              <span> </span>
              as read
            </span>
          )}
          className={className}
          ref={ref}
        >
          <i className="i-mgc-check-circle-cute-re" />
        </ActionButton>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent className="flex w-fit flex-col items-center justify-center gap-3 !py-3 [&_button]:text-xs">
          <div className="text-sm">
            Mark
            <span> </span>
            {which}
            <span> </span>
            as read?
          </div>
          <div className="space-x-4">
            <IconButton
              icon={<i className="i-mgc-check-filled" />}
              onClick={() => {
                handleMarkAllAsRead()
                setMarkPopoverOpen(false)
              }}
            >
              Confirm
            </IconButton>
          </div>
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  )
})

export const FlatMarkAllReadButton: FC<MarkAllButtonProps> = (props) => {
  const { className, filter, which } = props
  const [status, setStatus] = useState<"initial" | "confirm" | "done">(
    "initial",
  )
  const handleMarkAll = useMarkAllByRoute(filter)

  if (status === "done") return null
  const animate = {
    initial: { rotate: -30, opacity: 0.9 },
    exit: { rotate: -30, opacity: 0.9 },
    animate: { rotate: 0, opacity: 1 },
  }
  return (
    <Button
      variant="ghost"
      className={cn("center relative flex h-auto gap-1", className)}
      onMouseLeave={() => {
        if (status === "confirm") {
          setStatus("initial")
        }
      }}
      onClick={() => {
        if (status === "confirm") {
          handleMarkAll()
            .then(() => setStatus("done"))
            .catch(() => setStatus("initial"))
          return
        }

        setStatus("confirm")
      }}
    >
      <AnimatePresence mode="wait">
        {status === "confirm" ? (
          <m.i key={1} {...animate} className="i-mgc-question-cute-re" />
        ) : (
          <m.i key={2} {...animate} className="i-mgc-check-circle-cute-re" />
        )}
      </AnimatePresence>
      <span
        className={cn(
          status === "confirm" ? "opacity-0" : "opacity-100",
          "duration-200",
        )}
      >
        Mark
        {which}
        {" "}
        as read
      </span>
      <span
        className={cn(
          "center absolute inset-y-0 left-5 right-0 flex",
          status === "confirm" ? "opacity-100" : "opacity-0",
          "duration-200",
        )}
      >
        Confirm?
      </span>
    </Button>
  )
}
