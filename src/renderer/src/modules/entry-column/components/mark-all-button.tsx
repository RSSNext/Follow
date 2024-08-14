import { PopoverPortal } from "@radix-ui/react-popover"
import {
  ActionButton,
  Button,
  StyledButton,
} from "@renderer/components/ui/button"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@renderer/components/ui/popover"
import { shortcuts } from "@renderer/constants/shortcuts"
import { useRouteParms } from "@renderer/hooks/biz/useRouteParams"
import { cn } from "@renderer/lib/utils"
import {
  subscriptionActions,
  useFolderFeedsByFeedId,
} from "@renderer/store/subscription"
import { AnimatePresence, m } from "framer-motion"
import type { FC, ReactNode } from "react"
import { forwardRef, useCallback, useState } from "react"

interface MarkAllButtonProps {
  filter?: {
    startTime: number
    endTime: number
  }
  className?: string
  which?: ReactNode

  shortcut?: boolean
}
export const MarkAllButton = forwardRef<HTMLButtonElement, MarkAllButtonProps>(
  ({ filter, className, which = "all", shortcut }, ref) => {
    const [markPopoverOpen, setMarkPopoverOpen] = useState(false)

    const handleMarkAllAsRead = useMarkAll(filter)

    return (
      <Popover open={markPopoverOpen} onOpenChange={setMarkPopoverOpen}>
        <PopoverTrigger asChild>
          <ActionButton
            shortcut={
              shortcut ? shortcuts.entries.markAllAsRead.key : undefined
            }
            tooltip={(
              <span>
                Mark
                {" "}
                {which}
                {" "}
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
          <PopoverContent className="flex w-fit flex-col items-center justify-center gap-3 text-[0.94rem] font-medium">
            <div>
              Mark
              {which}
              {" "}
              as read?
            </div>
            <div className="space-x-4">
              <PopoverClose>
                <StyledButton variant="outline">Cancel</StyledButton>
              </PopoverClose>

              <StyledButton
                onClick={() => {
                  handleMarkAllAsRead()
                  setMarkPopoverOpen(false)
                }}
              >
                Confirm
              </StyledButton>
            </div>
          </PopoverContent>
        </PopoverPortal>
      </Popover>
    )
  },
)

export const FlatMarkAllButton: FC<MarkAllButtonProps> = (props) => {
  const { className, filter, which } = props
  const [status, setStatus] = useState<"initial" | "confirm" | "done">(
    "initial",
  )
  const handleMarkAll = useMarkAll(filter)

  if (status === "done") return null
  const animate = {
    initial: { rotate: -30, opacity: 0.9 },
    exit: { rotate: -30, opacity: 0.9 },
    animate: { rotate: 0, opacity: 1 },
  }
  return (
    <Button
      variant="ghost"
      className={cn("center relative flex h-auto gap-1 !py-1.5", className)}
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

const useMarkAll = (filter: MarkAllButtonProps["filter"]) => {
  const routerParams = useRouteParms()
  const { feedId, view } = routerParams
  const folderIds = useFolderFeedsByFeedId({
    feedId,
    view,
  })

  return useCallback(async () => {
    if (!routerParams) return

    if (typeof routerParams.feedId === "number" || routerParams.isAllFeeds) {
      subscriptionActions.markReadByView(view, filter)
    } else if (folderIds) {
      subscriptionActions.markReadByFeedIds(view, folderIds, filter)
    } else if (routerParams.feedId) {
      subscriptionActions.markReadByFeedIds(
        view,
        routerParams.feedId?.split(","),
        filter,
      )
    }
  }, [routerParams, folderIds, view, filter])
}
