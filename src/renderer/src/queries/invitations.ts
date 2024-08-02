import { apiClient } from "@renderer/lib/api-fetch"
import { useMutation } from "@tanstack/react-query"

import type { MutationBaseProps } from "./types"

export const useInvitationMutation = ({ onError }: MutationBaseProps = {}) =>
  useMutation({
    mutationFn: (code: string) =>
      apiClient.invitations.use.$post({ json: { code } }),

    onError: (error) => {
      onError?.(error)
    },
  })
