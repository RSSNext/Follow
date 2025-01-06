import type { FeedViewType } from "@follow/constants"

import { CommandActionButton } from "~/components/ui/button/CommandActionButton"
import { useHasModal } from "~/components/ui/modal/stacked/hooks"
import { shortcuts } from "~/constants/shortcuts"
import { useEntryActions } from "~/hooks/biz/useEntryActions"
import { COMMAND_ID } from "~/modules/command/commands/id"
import { useCommandHotkey } from "~/modules/command/hooks/use-register-hotkey"
import { useToolbarOrderMap } from "~/modules/customize-toolbar/hooks"
import { useEntry } from "~/store/entry/hooks"

export const EntryHeaderActions = ({ entryId, view }: { entryId: string; view?: FeedViewType }) => {
  const actionConfigs = useEntryActions({ entryId, view })
  const orderMap = useToolbarOrderMap()
  const entry = useEntry(entryId)

  const hasModal = useHasModal()

  useCommandHotkey({
    when: !!entry?.entries.url && !hasModal,
    shortcut: shortcuts.entry.openInBrowser.key,
    commandId: COMMAND_ID.entry.openInBrowser,
    args: [{ entryId }],
  })

  return actionConfigs
    .filter((item) => {
      const order = orderMap.get(item.id)
      if (!order) return false
      return order.type === "main"
    })
    .sort((a, b) => {
      const orderA = orderMap.get(a.id)?.order || 0
      const orderB = orderMap.get(b.id)?.order || 0
      return orderA - orderB
    })
    .map((config) => {
      return (
        <CommandActionButton
          active={config.active}
          key={config.id}
          disableTriggerShortcut={hasModal}
          commandId={config.id}
          onClick={config.onClick}
          shortcut={config.shortcut}
        />
      )
    })
}
