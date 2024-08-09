import { PopoverPortal } from "@radix-ui/react-popover"
import { ActionButton, StyledButton } from "@renderer/components/ui/button"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@renderer/components/ui/popover"
import { shortcuts } from "@renderer/constants/shortcuts"
import { useRouteParms } from "@renderer/hooks/biz/useRouteParams"
import {
  subscriptionActions,
  useFolderFeedsByFeedId,
} from "@renderer/store/subscription"
import { forwardRef, useCallback, useState } from "react"

export const MarkAllButton = forwardRef<
  HTMLButtonElement,
  {
    filter?: {
      startTime: number
      endTime: number
    }
    className?: string
  }
>(({ filter, className }, ref) => {
  const [markPopoverOpen, setMarkPopoverOpen] = useState(false)

  const routerParams = useRouteParms()
  const { feedId, view } = routerParams
  const folderIds = useFolderFeedsByFeedId({
    feedId,
    view,
  })

  const handleMarkAllAsRead = useCallback(async () => {
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
  }, [feedId, folderIds, filter, routerParams])

  return (
    <Popover open={markPopoverOpen} onOpenChange={setMarkPopoverOpen}>
      <PopoverTrigger asChild>
        <ActionButton
          shortcut={shortcuts.entries.markAllAsRead.key}
          tooltip="Mark All as Read"
          className={className}
          ref={ref}
        >
          <i className="i-mgc-check-circle-cute-re" />
        </ActionButton>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent className="flex w-fit flex-col items-center justify-center gap-3 text-[0.94rem] font-medium">
          <div>Mark all as read?</div>
          <div className="space-x-4">
            <PopoverClose>
              <StyledButton variant="outline">Cancel</StyledButton>
            </PopoverClose>
            {/* TODO */}
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
})
