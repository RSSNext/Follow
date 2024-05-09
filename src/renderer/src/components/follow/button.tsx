import { Button } from "@renderer/components/ui/button"
import { Dialog, DialogTrigger } from "@renderer/components/ui/dialog"
import { FollowDialog } from "./dialog"
import { FeedResponse } from "@renderer/lib/types"

export function FollowButton({ feed }: { feed: Partial<FeedResponse> }) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>Follow</Button>
      </DialogTrigger>
      <FollowDialog feed={feed} />
    </Dialog>
  )
}
