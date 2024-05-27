/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DefinedQuery } from "@renderer/lib/defineQuery"
import type { QueryKey, UseQueryOptions, UseQueryResult } from "@tanstack/react-query"
import {
  useQuery,
} from "@tanstack/react-query"
import type { FetchError } from "ofetch"

export type SafeReturnType<T> = T extends (...args: any[]) => infer R
  ? R
  : never

export function useBizQuery<
  TQuery extends DefinedQuery<QueryKey, any, any>,
  TError = FetchError,
  TQueryFnData = Awaited<ReturnType<TQuery["fn"]>>,
  TTransformedData = Awaited<SafeReturnType<TQuery["transform"]>>,
  TData = SafeReturnType<TQuery["transform"]> extends never
    ? TQueryFnData
    : TTransformedData,
>(
  query: TQuery,
  options: Omit<UseQueryOptions<TQueryFnData, TError>, "queryKey" | "queryFn"> = {},
): UseQueryResult<TData, FetchError> {
  // @ts-expect-error
  return useQuery({
    queryKey: query.key,
    queryFn: query.fn,
    ...options,
  })
}
