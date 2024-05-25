import { Button } from "@renderer/components/ui/button"
import { Dialog, DialogTrigger } from "@renderer/components/ui/dialog"
import type { FeedResponse } from "@renderer/lib/types"
import { useState } from "react"

import { FollowDialog } from "./dialog"

export function FollowButton({ feed }: { feed: FeedResponse }) {
  const [open, setOpen] = useState(false)
  const [isSuccessful, setIsSuccessful] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {isSuccessful ?
            (
              <Button variant="outline" disabled>
                Followed
              </Button>
            ) :
            (
              <Button>Follow</Button>
            )}
      </DialogTrigger>
      <FollowDialog
        feed={{
          feeds: feed,
        }}
        onSuccess={() => {
          setOpen(false)
          setIsSuccessful(true)
        }}
        isSubscribed={false}
      />
    </Dialog>
  )
}
