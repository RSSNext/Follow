import { IN_ELECTRON } from "@follow/shared/constants"
import { UrlBuilder } from "@follow/utils/url-builder"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { useModalStack } from "~/components/ui/modal/stacked/hooks"
import { useNavigateEntry } from "~/hooks/biz/useNavigateEntry"
import { useRouteParams } from "~/hooks/biz/useRouteParams"
import { useDeleteSubscription } from "~/hooks/biz/useSubscriptionActions"
import { ListForm } from "~/modules/discover/list-form"
import type { SubscriptionFlatModel } from "~/store/subscription"
import { useSubscriptionByFeedId } from "~/store/subscription"

import { useUserFocusValue } from "../contexts/focus"
import { useRegisterCommandEffect } from "../hooks/use-register-command-effect"
import { COMMAND_ID } from "./id"

export const useRegisterListCommands = () => {
  const { t } = useTranslation()
  const { view, listId: routeListId } = useRouteParams()
  const userFocus = useUserFocusValue()
  const isFocusListMenu = userFocus.type === "list"
  const focusListId = isFocusListMenu ? userFocus.listId : null

  const { mutateAsync: deleteSubscription } = useDeleteSubscription()
  const navigateEntry = useNavigateEntry()
  const subscription: SubscriptionFlatModel | null = useSubscriptionByFeedId(routeListId ?? "")
  const { present } = useModalStack()

  useRegisterCommandEffect([
    {
      id: COMMAND_ID.list.edit,
      label: t("sidebar.feed_actions.edit"),
      keyBinding: "E",
      when: isFocusListMenu,
      run: ({ context: { listId = focusListId } }) => {
        if (!listId) return
        present({
          title: t("sidebar.feed_actions.edit_list"),
          content: ({ dismiss }) => <ListForm asWidget id={listId} onSuccess={dismiss} />,
        })
      },
    },
    {
      id: COMMAND_ID.list.unfollow,
      label: t("sidebar.feed_actions.unfollow"),
      keyBinding: "Meta+Backspace",
      when: isFocusListMenu,
      run: () => deleteSubscription({ subscription }),
    },
    {
      id: COMMAND_ID.list.navigateTo,
      label: t("sidebar.feed_actions.navigate_to_list"),
      keyBinding: "Meta+G",
      when: isFocusListMenu && routeListId !== focusListId,
      run: ({ context: { listId = focusListId } }) => {
        if (!listId) return
        navigateEntry({ listId })
      },
    },
    {
      id: COMMAND_ID.list.openInBrowser,
      label: t("sidebar.feed_actions.open_list_in_browser", {
        which: IN_ELECTRON ? t("words.browser") : t("words.newTab"),
      }),
      keyBinding: "O",
      when: isFocusListMenu,
      run: ({ context: { listId = focusListId } }) => {
        if (!listId) return
        window.open(UrlBuilder.shareList(listId, view), "_blank")
      },
    },
    {
      id: COMMAND_ID.list.copyUrl,
      label: t("sidebar.feed_actions.copy_list_url"),
      keyBinding: "Meta+C",
      when: isFocusListMenu,
      run: async ({ context: { listId = focusListId } }) => {
        if (!listId) return
        await navigator.clipboard.writeText(UrlBuilder.shareList(listId, view))
        toast.success("copy success!", {
          duration: 1000,
        })
      },
    },
    {
      id: COMMAND_ID.list.copyId,
      label: t("sidebar.feed_actions.copy_list_id"),
      keyBinding: "Meta+Shift+C",
      when: isFocusListMenu,
      run: async ({ context: { listId = focusListId } }) => {
        if (!listId) return
        await navigator.clipboard.writeText(listId)
        toast.success("copy success!", {
          duration: 1000,
        })
      },
    },
  ])
}
