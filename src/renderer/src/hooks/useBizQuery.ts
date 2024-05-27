/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RequestError } from "@renderer/biz/error"
import type { DefinedQuery } from "@renderer/lib/defineQuery"
import type {
  InfiniteData,
  QueryKey,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import type { FetchError } from "ofetch"

// TODO split normal define query and infinite define query for better type checking
export type SafeReturnType<T> = T extends (...args: any[]) => infer R
  ? R
  : never

export function useBizQuery<
  TQuery extends DefinedQuery<QueryKey, any>,
  TError = FetchError | RequestError,
  TQueryFnData = Awaited<ReturnType<TQuery["fn"]>>,
  TData = TQueryFnData,
>(
  query: TQuery,
  options: Omit<
    UseQueryOptions<TQueryFnData, TError>,
    "queryKey" | "queryFn"
  > = {},
): UseQueryResult<TData, FetchError> {
  // @ts-expect-error
  return useQuery({
    queryKey: query.key,
    queryFn: query.fn,
    ...options,
  })
}

export function useBizInfiniteQuery<
  T extends DefinedQuery<any, any>,
  E = FetchError | RequestError,
  FNR = Awaited<ReturnType<T["fn"]>>,
  R = FNR,
>(
  query: T,
  options: Omit<UseInfiniteQueryOptions<FNR, E>, "queryKey" | "queryFn">,
): UseInfiniteQueryResult<InfiniteData<R>, FetchError | RequestError> {
  // @ts-expect-error
  return useInfiniteQuery<T, E>({
    // @ts-expect-error
    queryFn: query.fn,
    queryKey: query.key,
    ...options,
  })
}
