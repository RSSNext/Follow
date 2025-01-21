import { FeedViewType } from "@follow/constants"
import { jotaiStore } from "@follow/utils"
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai"
import { useCallback, useMemo } from "react"

import { views } from "@/src/constants/views"

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
}

export const useViewDefinition = (view: FeedViewType) => {
  const viewDef = useMemo(() => views.find((v) => v.view === view), [view])
  if (!viewDef) {
    throw new Error(`View ${view} not found`)
  }
  return viewDef
}
