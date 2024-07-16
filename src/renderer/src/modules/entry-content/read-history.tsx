import { useMe } from "@renderer/atoms/user"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip"
import { useEntryReadHistory } from "@renderer/store/entry"
import { useUserById } from "@renderer/store/user"
import { Fragment } from "react"

export const EntryReadHistory: Component<{ entryId: string }> = ({
  entryId,
}) => {
  const me = useMe()
  const entryHistory = useEntryReadHistory(entryId)

  if (!entryHistory) return null

  if (!me) return null

  return (
    <div className="flex items-center">
      {[me.id]
        .concat(entryHistory.userIds?.filter((id) => id !== me?.id) ?? []) // then others
        .slice(0, 10)

        .map((userId, i) => (
          <Fragment key={userId}>
            <EntryUser userId={userId} i={i} />
          </Fragment>
        ))}

      {entryHistory.readCount && entryHistory.readCount > 10 && (
        <Tooltip>
          <TooltipTrigger>
            <div className="relative z-[11] flex size-8 items-center justify-center rounded-full border border-border bg-zinc-200 dark:bg-neutral-800">
              <span className="text-xs font-medium text-zinc-500 dark:text-neutral-400">
                +
                {entryHistory.readCount - 10}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">More</TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}

const EntryUser: Component<{ userId: string, i: number }> = ({ userId, i }) => {
  const user = useUserById(userId)
  if (!user) return null
  return (
    <Tooltip>
      <TooltipTrigger>
        <div
          className="relative"
          style={{
            transform: `translateX(-${i * 8}px)`,
            zIndex: i,
          }}
        >
          <Avatar className="aspect-square size-8 border border-border">
            <AvatarImage src={user?.image || undefined} />
            <AvatarFallback>{user.name?.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        Recent reader:
        {" "}

        {user.name}
      </TooltipContent>
    </Tooltip>
  )
}
