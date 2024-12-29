import { useMutation } from "@tanstack/react-query"

import { apiClient } from "~/lib/api-fetch"
import { defineQuery } from "~/lib/defineQuery"

import type { MutationBaseProps } from "./types"

export const useUseRSSHubMutation = ({ onError }: MutationBaseProps = {}) =>
  useMutation({
    mutationFn: (id: string) => apiClient.rsshub.use.$post({ json: { id } }),

    onError: (error) => {
      onError?.(error)
    },
  })

export const useAddRSSHubMutation = ({ onError }: MutationBaseProps = {}) =>
  useMutation({
    mutationFn: ({ baseUrl, accessKey }: { baseUrl: string; accessKey: string }) =>
      apiClient.rsshub.$post({
        json: {
          baseUrl,
          accessKey,
        },
      }),

    onError: (error) => {
      onError?.(error)
    },
  })

export const useDeleteRSSHubMutation = ({ onError }: MutationBaseProps = {}) =>
  useMutation({
    mutationFn: (id: string) => apiClient.rsshub.$delete({ json: { id } }),

    onError: (error) => {
      onError?.(error)
    },
  })

export const rsshub = {
  get: ({ id }: { id: string }) =>
    defineQuery(["rsshub", "get", id], async () => {
      const res = await apiClient.rsshub.$get({ query: { id } })
      return res.data
    }),

  list: () =>
    defineQuery(["rsshub", "list"], async () => {
      const res = await apiClient.rsshub.list.$get()
      return res.data
    }),
}
