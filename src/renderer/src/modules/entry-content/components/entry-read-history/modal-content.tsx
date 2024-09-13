import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { m } from "@renderer/components/common/Motion"
import { ActionButton } from "@renderer/components/ui/button"
import { useCurrentModal } from "@renderer/components/ui/modal"
import { ScrollArea } from "@renderer/components/ui/scroll-area"
import { stopPropagation } from "@renderer/lib/dom"
import { cn } from "@renderer/lib/utils"
import { usePresentUserProfileModal } from "@renderer/modules/profile/hooks"
import { useEntryReadHistory } from "@renderer/store/entry"
import { useUserById } from "@renderer/store/user"
import { memo, useState } from "react"

export function EntryReadHistoryModalContent({ entryId }: { entryId: string }) {
  const entryHistory = useEntryReadHistory(entryId)
  const winHeight = useState(() => window.innerHeight)[0]
  const modal = useCurrentModal()

  return (
    <div
      className={"container center h-full"}
      onPointerDown={modal.dismiss}
      onClick={stopPropagation}
    >
      <m.div
        initial={{
          y: "100%",
          opacity: 0.9,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        exit={{
          y: winHeight,
        }}
        transition={{
          type: "spring",
          mass: 0.4,
          tension: 100,
          friction: 1,
        }}
        layout="size"
        className={cn(
          "relative flex flex-col items-center overflow-hidden rounded-xl border bg-theme-background p-8",
          "h-[80vh] w-[400px] max-w-full shadow lg:max-h-[calc(100vh-10rem)]",
        )}
        onPointerDown={stopPropagation}
      >
        <div className="absolute right-2 top-2 z-10 flex items-center gap-2 text-[20px] opacity-80">
          <ActionButton tooltip="Close" onClick={modal.dismiss}>
            <i className="i-mgc-close-cute-re" />
          </ActionButton>
        </div>
        <h1 className="text-center text-lg font-bold">Users who read this entry recently</h1>
        <ScrollArea.ScrollArea rootClassName="w-full mt-4">
          {entryHistory && entryHistory.userIds && entryHistory.userIds.length > 0 && (
            <div className="flex flex-col gap-2">
              {entryHistory.userIds.map((userId) => (
                <EntryUser userId={userId} key={userId} />
              ))}
            </div>
          )}
        </ScrollArea.ScrollArea>
      </m.div>
    </div>
  )
}

const EntryUser: Component<{ userId: string }> = memo(({ userId }) => {
  const user = useUserById(userId)
  const presentUserProfile = usePresentUserProfileModal("drawer")

  if (!user) return null

  return (
    <button
      type="button"
      className="flex items-center gap-4"
      onClick={() => {
        presentUserProfile(userId)
      }}
    >
      <Avatar className="aspect-square size-10 overflow-hidden rounded-full border border-border">
        <AvatarImage src={user?.image || undefined} />
        <AvatarFallback>{user.name?.slice(0, 2)}</AvatarFallback>
      </Avatar>

      {user.name && <p className="text-sm">{user.name}</p>}
    </button>
  )
})
