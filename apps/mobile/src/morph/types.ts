/* eslint-disable @typescript-eslint/no-namespace */
import type { apiClient } from "../lib/api-fetch"

// Add ExtractData type utility
type ExtractData<T extends (...args: any) => any> =
  Awaited<ReturnType<T>> extends { data: infer D } ? D : never

export namespace HonoApiClient {
  export type Subscription_Get = ExtractData<typeof apiClient.subscriptions.$get>
  export type List_Get = ExtractData<typeof apiClient.lists.$get>
}
