import { Button } from "@renderer/components/ui/button"
import { Dialog, DialogTrigger } from "@renderer/components/ui/dialog"
import { FollowDialog } from "./dialog"
import { FeedResponse } from "@renderer/lib/types"
import { useState } from "react"

export function FollowButton({ feed }: { feed: Partial<FeedResponse> }) {
  const [open, setOpen] = useState(false)
  const [isSuccessful, setIsSuccessful] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {isSuccessful ? (
          <Button variant="outline" disabled>
            Followed
          </Button>
        ) : (
          <Button>Follow</Button>
        )}
      </DialogTrigger>
      <FollowDialog
        feed={feed}
        onSuccess={() => {
          setOpen(false)
          setIsSuccessful(true)
        }}
      />
    </Dialog>
  )
}
