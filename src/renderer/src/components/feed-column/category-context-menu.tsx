import { useState } from "react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@renderer/components/ui/context-menu"
import { Dialog, DialogTrigger } from "@renderer/components/ui/dialog"
import { CategoryRenameDialog } from "./category-rename-dialog"
import { CategoryRemoveDialog } from "./category-remove-dialog"
import {
  AlertDialog,
  AlertDialogTrigger,
} from "@renderer/components/ui/alert-dialog"

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

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialog>
        <ContextMenu onOpenChange={(open) => onOpenChange?.(open)}>
          <ContextMenuTrigger className="w-full">{children}</ContextMenuTrigger>
          <ContextMenuContent onClick={(e) => e.stopPropagation()}>
            <DialogTrigger asChild>
              <ContextMenuItem>Rename Category</ContextMenuItem>
            </DialogTrigger>
            <AlertDialogTrigger>
              <ContextMenuItem>Remove Category</ContextMenuItem>
            </AlertDialogTrigger>
          </ContextMenuContent>
        </ContextMenu>
        <CategoryRenameDialog
          feedIdList={feedIdList}
          view={view}
          category={name}
          onSuccess={() => setDialogOpen(false)}
        />
        <CategoryRemoveDialog
          feedIdList={feedIdList}
          view={view}
          category={name}
          onSuccess={() => setDialogOpen(false)}
        />
      </AlertDialog>
    </Dialog>
  )
}
