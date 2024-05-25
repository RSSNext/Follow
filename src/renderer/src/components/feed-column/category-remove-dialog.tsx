import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@renderer/lib/queries/api-fetch"
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@renderer/components/ui/alert-dialog"

export function CategoryRemoveDialog({
  feedIdList,
  onSuccess,
  category,
  view,
}: {
  feedIdList: string[]
  onSuccess?: () => void
  category: string
  view?: number
}) {
  const queryClient = useQueryClient()
  const renameMutation = useMutation({
    mutationFn: async () =>
      apiFetch("/categories", {
        method: "DELETE",
        body: {
          feedIdList,
          deleteSubscriptions: false,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subscriptions", view],
      })
      onSuccess?.()
    },
  })

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Remove category
          {" "}
          <span className="font-bold">{category}</span>
          ?
        </AlertDialogTitle>
        <AlertDialogDescription>
          This operation will delete your category, but the feeds it contains
          will be retained and grouped by website.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={() => renameMutation.mutate()}>
          Continue
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
