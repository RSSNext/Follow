import { useState } from "react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@renderer/components/ui/context-menu"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@renderer/components/ui/use-toast"
import { ToastAction } from "@renderer/components/ui/toast"
import { apiFetch } from "@renderer/lib/queries/api-fetch"
import { Dialog, DialogTrigger } from "@renderer/components/ui/dialog"
import { CategoryRenameDialog } from "./category-rename-dialog"

export function CategoryContextMenu({
  name,
  view,
  children,
  onOpenChange,
  feedIdList,
}: {
  name: string
  view?: number
  children: React.ReactNode
  onOpenChange?: (open: boolean) => void
  feedIdList: string[]
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

  const queryClient = useQueryClient()

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <ContextMenu onOpenChange={(open) => onOpenChange?.(open)}>
        <ContextMenuTrigger className="w-full">{children}</ContextMenuTrigger>
        <ContextMenuContent onClick={(e) => e.stopPropagation()}>
          <DialogTrigger asChild>
            <ContextMenuItem>Rename Category</ContextMenuItem>
          </DialogTrigger>
          <ContextMenuItem>Remove Category</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Unfollow All</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <CategoryRenameDialog
        feedIdList={feedIdList}
        view={view}
        category={name}
        onSuccess={() => setDialogOpen(false)}
      />
    </Dialog>
  )
}
