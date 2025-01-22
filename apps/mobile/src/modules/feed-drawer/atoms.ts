import { FeedViewType } from "@follow/constants"
import { jotaiStore } from "@follow/utils"
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai"
import { useCallback, useMemo } from "react"

import { views } from "@/src/constants/views"
import { usePrefetchEntries } from "@/src/store/entry/hooks"
import type { FetchEntriesProps } from "@/src/store/entry/types"
import { getSubscriptionByCategory } from "@/src/store/subscription/getter"

// drawer open state

const drawerOpenAtom = atom<boolean>(false)

export function useFeedDrawer() {
  const [state, setState] = useAtom(drawerOpenAtom)

  return {
    isDrawerOpen: state,
    openDrawer: useCallback(() => setState(true), [setState]),
    closeDrawer: useCallback(() => setState(false), [setState]),
    toggleDrawer: useCallback(() => setState(!state), [setState, state]),
  }
}

export const closeDrawer = () => jotaiStore.set(drawerOpenAtom, false)

// is drawer swipe disabled

const isDrawerSwipeDisabledAtom = atom<boolean>(true)

export function useIsDrawerSwipeDisabled() {
  return useAtomValue(isDrawerSwipeDisabledAtom)
}

export function useSetDrawerSwipeDisabled() {
  return useSetAtom(isDrawerSwipeDisabledAtom)
}

// collection panel selected state

type CollectionPanelState =
  | {
      type: "view"
      viewId: FeedViewType
    }
  | {
      type: "list"
      listId: string
    }

const collectionPanelStateAtom = atom<CollectionPanelState>({
  type: "view",
  viewId: FeedViewType.Articles,
})

export function useSelectedCollection() {
  return useAtomValue(collectionPanelStateAtom)
}
export const selectCollection = (state: CollectionPanelState) => {
  jotaiStore.set(collectionPanelStateAtom, state)
  if (state.type === "view" || state.type === "list") {
    jotaiStore.set(selectedFeedAtom, state)
  }
}

// feed panel selected state

export type SelectedFeed =
  | {
      type: "view"
      viewId: FeedViewType
    }
  | {
      type: "feed"
      feedId: string
    }
  | {
      type: "category"
      categoryName: string
    }
  | {
      type: "list"
      listId: string
    }
  | {
      type: "inbox"
      inboxId: string
    }

const selectedFeedAtom = atom<SelectedFeed>({
  type: "view",
  viewId: FeedViewType.Articles,
})

export function useSelectedFeed() {
  const selectedFeed = useAtomValue(selectedFeedAtom)
  let payload: FetchEntriesProps = {}
  switch (selectedFeed.type) {
    case "view": {
      payload = { view: selectedFeed.viewId }
      break
    }
    case "feed": {
      payload = { feedId: selectedFeed.feedId }
      break
    }
    case "category": {
      payload = { feedId: getSubscriptionByCategory(selectedFeed.categoryName).join(",") }
      break
    }
    case "list": {
      payload = { listId: selectedFeed.listId }
      break
    }
    case "inbox": {
      payload = { inboxId: selectedFeed.inboxId }
      break
    }
    // No default
  }
  usePrefetchEntries(payload)
  return selectedFeed
}

export const selectFeed = (state: SelectedFeed) => {
  jotaiStore.set(selectedFeedAtom, state)
}

export const useViewDefinition = (view: FeedViewType) => {
  const viewDef = useMemo(() => views.find((v) => v.view === view), [view])
  if (!viewDef) {
    throw new Error(`View ${view} not found`)
  }
  return viewDef
}
