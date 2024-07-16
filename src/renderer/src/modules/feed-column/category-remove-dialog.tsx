import { subscriptionActions } from "@renderer/store/subscription"
import { useMutation } from "@tanstack/react-query"

import { StyledButton } from "../../components/ui/button"
import { useCurrentModal } from "../../components/ui/modal"

export function CategoryRemoveDialogContent({
  feedIdList,
}: {
  feedIdList: string[]
}) {
  const deleteMutation = useMutation({
    mutationFn: () => subscriptionActions.deleteCategory(feedIdList),
  })

  const { dismiss } = useCurrentModal()

  return (
    <div className="flex w-[65ch] max-w-full flex-col gap-4">
      <p>
        This operation will delete your category, but the feeds it contains will
        be retained and grouped by website.
      </p>

      <div className="flex items-center justify-end gap-3">
        <StyledButton variant="outline" onClick={dismiss}>
          Cancel
        </StyledButton>
        <StyledButton
          isLoading={deleteMutation.isPending}
          onClick={() => deleteMutation.mutateAsync().then(() => dismiss())}
        >
          Continue
        </StyledButton>
      </div>
    </div>
  )
}
