import { apiClient, getFetchErrorMessage } from "@renderer/lib/api-fetch"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export const useInvitationMutation = () => useMutation({
  mutationFn: (code: string) => apiClient.invitations.use.$post({ json: { code } }),
  onSuccess() {},
  async onError(err) {
    toast.error(await getFetchErrorMessage(err))
  },
})
