import { useMutation } from "@tanstack/react-query"
import { AnimatePresence, m } from "framer-motion"
import type { FC } from "react"
import { Fragment, memo, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useOnClickOutside } from "usehooks-ts"

import { MotionButtonBase } from "~/components/ui/button"
import { LoadingCircle } from "~/components/ui/loading"
import { useScrollViewElement } from "~/components/ui/scroll-area/hooks"
import { ROUTE_FEED_IN_FOLDER, views } from "~/constants"
import { useNavigateEntry } from "~/hooks/biz/useNavigateEntry"
import { getRouteParams, useRouteParamsSelector } from "~/hooks/biz/useRouteParams"
import { useAnyPointDown, useInputComposition, useRefValue } from "~/hooks/common"
import { stopPropagation } from "~/lib/dom"
import type { FeedViewType } from "~/lib/enum"
import { showNativeMenu } from "~/lib/native-menu"
import { cn, sortByAlphabet } from "~/lib/utils"
import { getPreferredTitle, useAddFeedToFeedList, useFeedStore } from "~/store/feed"
import { useOwnedList } from "~/store/list"
import {
  subscriptionActions,
  subscriptionCategoryExist,
  useSubscriptionByFeedId,
} from "~/store/subscription"
import { useFeedUnreadStore } from "~/store/unread"

import { useModalStack } from "../../components/ui/modal/stacked/hooks"
import { ListCreationModalContent } from "../settings/tabs/lists/modals"
import { useFeedListSortSelector } from "./atom"
import { CategoryRemoveDialogContent } from "./category-remove-dialog"
import { FeedItem } from "./item"
import { feedColumnStyles } from "./styles"
import { UnreadNumber } from "./unread-number"

type FeedId = string
interface FeedCategoryProps {
  data: FeedId[]
  view?: number
  categoryOpenStateData: Record<string, boolean>
}

function FeedCategoryImpl({ data: ids, view, categoryOpenStateData }: FeedCategoryProps) {
  const { t } = useTranslation()

  const sortByUnreadFeedList = useFeedUnreadStore((state) =>
    ids.sort((a, b) => (state.data[b] || 0) - (state.data[a] || 0)),
  )

  const navigate = useNavigateEntry()

  const subscription = useSubscriptionByFeedId(ids[0])
  const folderName = subscription?.category || subscription.defaultCategory

  const showCollapse = sortByUnreadFeedList.length > 1 || subscription?.category

  const [open, setOpen] = useState(() => {
    if (!showCollapse) return true
    if (folderName && typeof categoryOpenStateData[folderName] === "boolean") {
      return categoryOpenStateData[folderName]
    }
    return false
  })

  const shouldOpen = useRouteParamsSelector(
    (s) => typeof s.feedId === "string" && ids.includes(s.feedId),
  )
  const scroller = useScrollViewElement()
  const scrollerRef = useRefValue(scroller)
  useEffect(() => {
    if (shouldOpen) {
      setOpen(true)

      const $items = itemsRef.current

      if (!$items) return
      const $target = $items.querySelector(
        `[data-feed-id="${getRouteParams().feedId}"]`,
      ) as HTMLElement
      if (!$target) return

      const $scroller = scrollerRef.current
      if (!$scroller) return

      const scrollTop = $target.offsetTop - $scroller.clientHeight / 2
      $scroller.scrollTo({
        top: scrollTop,
        behavior: "smooth",
      })
    }
  }, [scrollerRef, shouldOpen])
  const expansion = folderName ? categoryOpenStateData[folderName] : true

  useEffect(() => {
    if (showCollapse) {
      setOpen(expansion)
    }
  }, [expansion])

  const itemsRef = useRef<HTMLDivElement>(null)

  const toggleCategoryOpenState = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (!isCategoryEditing) {
      setCategoryActive()
    }
    if (view !== undefined && folderName) {
      subscriptionActions.toggleCategoryOpenState(view, folderName)
    }
  }

  const setCategoryActive = () => {
    if (view !== undefined) {
      navigate({
        entryId: null,
        folderName,
        view,
      })
    }
  }

  const unread = useFeedUnreadStore((state) =>
    ids.reduce((acc, feedId) => (state.data[feedId] || 0) + acc, 0),
  )

  const isActive = useRouteParamsSelector(
    (routerParams) => routerParams.feedId === `${ROUTE_FEED_IN_FOLDER}${folderName}`,
  )
  const { present } = useModalStack()

  const { mutateAsync: changeCategoryView, isPending: isChangePending } = useMutation({
    mutationKey: ["changeCategoryView", folderName, view],
    mutationFn: async (nextView: FeedViewType) => {
      if (!folderName) return
      if (typeof view !== "number") return
      return subscriptionActions.changeCategoryView(folderName, view, nextView)
    },
  })

  const [isCategoryEditing, setIsCategoryEditing] = useState(false)

  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)
  useAnyPointDown(() => {
    setIsContextMenuOpen(false)
  })
  const isCategoryIsWaiting = isChangePending

  const addMutation = useAddFeedToFeedList()

  const listList = useOwnedList(view!)

  return (
    <div tabIndex={-1} onClick={stopPropagation}>
      {!!showCollapse && (
        <div
          data-active={isActive || isContextMenuOpen}
          className={cn(
            "flex w-full cursor-menu items-center justify-between rounded-md px-2.5",
            feedColumnStyles.item,
          )}
          onClick={(e) => {
            e.stopPropagation()
            if (!isCategoryEditing) {
              setCategoryActive()
            }
          }}
          onContextMenu={(e) => {
            setIsContextMenuOpen(true)
            showNativeMenu(
              [
                {
                  type: "text",
                  label: t("sidebar.feed_column.context_menu.mark_as_read"),
                  click: () => {
                    subscriptionActions.markReadByFeedIds({
                      feedIds: ids,
                    })
                  },
                },
                { type: "separator" },
                {
                  type: "text",
                  label: t("sidebar.feed_column.context_menu.add_feeds_to_list"),
                  // @ts-expect-error
                  submenu: listList
                    ?.map((list) => ({
                      label: list.title || "",
                      type: "text",
                      click() {
                        return addMutation.mutate({
                          feedIds: ids,
                          listId: list.id,
                        })
                      },
                    }))
                    .concat([
                      // @ts-expect-error
                      { type: "separator" as const },
                      {
                        label: t("sidebar.feed_actions.create_list"),
                        type: "text" as const,

                        click() {
                          present({
                            title: t("sidebar.feed_actions.create_list"),
                            content: () => <ListCreationModalContent />,
                          })
                        },
                      },
                    ]),
                },
                { type: "separator" },
                {
                  type: "text",
                  label: t("sidebar.feed_column.context_menu.change_to_other_view"),
                  submenu: views
                    .filter((v) => v.view !== view)
                    .map((v) => ({
                      label: t(v.name),
                      type: "text" as const,
                      shortcut: (v.view + 1).toString(),
                      icon: v.icon,
                      click() {
                        return changeCategoryView(v.view)
                      },
                    })),
                },
                {
                  type: "text",
                  label: t("sidebar.feed_column.context_menu.rename_category"),
                  click: () => {
                    setIsCategoryEditing(true)
                  },
                },
                {
                  type: "text",
                  label: t("sidebar.feed_column.context_menu.delete_category"),
                  hide: !folderName || !subscriptionCategoryExist(folderName),
                  click: () => {
                    present({
                      title: t("sidebar.feed_column.context_menu.delete_category_confirmation", {
                        folderName,
                      }),
                      content: () => <CategoryRemoveDialogContent feedIdList={ids} />,
                    })
                  },
                },
              ],
              e,
            )
          }}
        >
          <div className="flex w-full min-w-0 items-center">
            <button
              type="button"
              onClick={toggleCategoryOpenState}
              data-state={open ? "open" : "close"}
              className={cn(
                "flex h-8 items-center [&_.i-mgc-right-cute-fi]:data-[state=open]:rotate-90",
              )}
              tabIndex={-1}
            >
              {isCategoryIsWaiting ? (
                <LoadingCircle size="small" className="mr-2 size-[16px]" />
              ) : isCategoryEditing ? (
                <MotionButtonBase
                  onClick={() => {
                    setIsCategoryEditing(false)
                  }}
                  className="center -ml-1 flex size-5 shrink-0 rounded-lg hover:bg-theme-button-hover"
                >
                  <i className="i-mgc-close-cute-re text-red-500 dark:text-red-400" />
                </MotionButtonBase>
              ) : (
                <div className="mr-2 size-[16px]">
                  <i className="i-mgc-right-cute-fi transition-transform" />
                </div>
              )}
            </button>
            {isCategoryEditing ? (
              <RenameCategoryForm
                currentCategory={folderName!}
                onFinished={() => setIsCategoryEditing(false)}
              />
            ) : (
              <Fragment>
                <span className="grow truncate">{folderName}</span>

                <UnreadNumber unread={unread} className="ml-2" />
              </Fragment>
            )}
          </div>
        </div>
      )}
      <AnimatePresence>
        {open && (
          <m.div
            ref={itemsRef}
            className="overflow-hidden"
            initial={
              !!showCollapse && {
                height: 0,
                opacity: 0.01,
              }
            }
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0.01,
            }}
          >
            <SortedFeedItems
              ids={ids}
              showCollapse={showCollapse as boolean}
              view={view as FeedViewType}
            />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const FeedCategory = memo(FeedCategoryImpl)

const RenameCategoryForm: FC<{
  currentCategory: string
  onFinished: () => void
}> = ({ currentCategory, onFinished }) => {
  const navigate = useNavigateEntry()
  const renameMutation = useMutation({
    mutationFn: async ({
      lastCategory,
      newCategory,
    }: {
      lastCategory: string
      newCategory: string
    }) => subscriptionActions.renameCategory(lastCategory, newCategory),
    onMutate({ lastCategory, newCategory }) {
      const routeParams = getRouteParams()

      if (routeParams.folderName === lastCategory) {
        navigate({
          folderName: newCategory,
        })
      }

      onFinished()
    },
  })
  const formRef = useRef<HTMLFormElement>(null)
  useOnClickOutside(
    formRef,
    () => {
      onFinished()
    },
    "mousedown",
  )
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    inputRef.current?.focus()
  }, [])
  const compositionInputProps = useInputComposition({
    onKeyDown: (e) => {
      if (e.key === "Escape") {
        onFinished()
      }
    },
  })
  return (
    <form
      ref={formRef}
      className="ml-3 flex w-full items-center"
      onSubmit={(e) => {
        e.preventDefault()

        return renameMutation.mutateAsync({
          lastCategory: currentCategory!,
          newCategory: e.currentTarget.category.value,
        })
      }}
    >
      <input
        {...compositionInputProps}
        ref={inputRef}
        name="category"
        autoFocus
        defaultValue={currentCategory}
        className="w-full appearance-none bg-transparent caret-accent"
      />
      <MotionButtonBase
        type="submit"
        className="center -mr-1 flex size-5 shrink-0 rounded-lg text-green-600 hover:bg-theme-button-hover dark:text-green-400"
      >
        <i className="i-mgc-check-filled size-3" />
      </MotionButtonBase>
    </form>
  )
}

type SortListProps = {
  ids: string[]
  view: FeedViewType
  showCollapse: boolean
}
const SortedFeedItems = (props: SortListProps) => {
  const by = useFeedListSortSelector((s) => s.by)
  switch (by) {
    case "count": {
      return <SortByUnreadList {...props} />
    }
    case "alphabetical": {
      return <SortByAlphabeticalList {...props} />
    }

    default: {
      return <SortByUnreadList {...props} />
    }
  }
}

const SortByAlphabeticalList = (props: SortListProps) => {
  const { ids, showCollapse, view } = props
  const isDesc = useFeedListSortSelector((s) => s.order === "desc")
  const sortedFeedList = useFeedStore((state) => {
    const res = ids.sort((a, b) => {
      const feedTitleA = getPreferredTitle(state.feeds[a]) || ""
      const feedTitleB = getPreferredTitle(state.feeds[b]) || ""
      return sortByAlphabet(feedTitleA, feedTitleB)
    })

    if (isDesc) {
      return res
    }
    return res.reverse()
  })
  return (
    <Fragment>
      {sortedFeedList.map((feedId) => (
        <FeedItem
          key={feedId}
          feedId={feedId}
          view={view}
          className={showCollapse ? "pl-6" : "pl-2.5"}
        />
      ))}
    </Fragment>
  )
}
const SortByUnreadList = ({ ids, showCollapse, view }: SortListProps) => {
  const isDesc = useFeedListSortSelector((s) => s.order === "desc")
  const sortByUnreadFeedList = useFeedUnreadStore((state) => {
    const res = ids.sort((a, b) => (state.data[b] || 0) - (state.data[a] || 0))
    return isDesc ? res : res.reverse()
  })

  return (
    <Fragment>
      {sortByUnreadFeedList.map((feedId) => (
        <FeedItem
          key={feedId}
          feedId={feedId}
          view={view}
          className={showCollapse ? "pl-6" : "pl-2.5"}
        />
      ))}
    </Fragment>
  )
}
