import { ActionButton } from "@follow/components/ui/button/index.js"
import type { FeedViewType } from "@follow/constants"

import { useHasModal } from "~/components/ui/modal/stacked/hooks"
import { shortcuts } from "~/constants/shortcuts"
import { useEntryActions } from "~/hooks/biz/useEntryActions"
import { COMMAND_ID } from "~/modules/command/commands/id"
import { useCommandHotkey } from "~/modules/command/hooks/use-register-hotkey"
import { useEntry } from "~/store/entry/hooks"

export const EntryHeaderActions = ({ entryId, view }: { entryId: string; view?: FeedViewType }) => {
  const actionConfigs = useEntryActions({ entryId, view })
  const entry = useEntry(entryId)

  const hasModal = useHasModal()

  useCommandHotkey({
    when: !!entry?.entries.url && !hasModal,
    shortcut: shortcuts.entry.openInBrowser.key,
    commandId: COMMAND_ID.entry.openInBrowser,
    args: [{ entryId }],
  })

  return actionConfigs
    .filter(
      (item) =>
        !item.id.startsWith("integration") &&
        !(
          [
            COMMAND_ID.entry.read,
            COMMAND_ID.entry.unread,
            COMMAND_ID.entry.copyLink,
            COMMAND_ID.entry.openInBrowser,
          ] as string[]
        ).includes(item.id),
    )
    .map((config) => {
      return (
        <ActionButton
          key={config.id}
          tooltip={config.name}
          icon={config.icon}
          onClick={config.onClick}
          shortcut={config.shortcut}
          active={config.active}
          disableTriggerShortcut={hasModal}
        />
      )
    })
}
