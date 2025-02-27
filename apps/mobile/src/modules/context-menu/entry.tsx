import { router } from "expo-router"
import type { PropsWithChildren } from "react"
import { useCallback } from "react"
import { Share, Text, View } from "react-native"

import {
  EntryContentWebView,
  setWebViewEntry,
} from "@/src/components/native/webview/EntryContentWebView"
import { ContextMenu } from "@/src/components/ui/context-menu"
import { PortalHost } from "@/src/components/ui/portal"
import { openLink } from "@/src/lib/native"
import { toast } from "@/src/lib/toast"
import { useSelectedView } from "@/src/modules/screen/atoms"
import { useIsEntryStarred } from "@/src/store/collection/hooks"
import { collectionSyncService } from "@/src/store/collection/store"
import { useEntry } from "@/src/store/entry/hooks"
import { unreadSyncService } from "@/src/store/unread/store"

export const EntryItemContextMenu = ({ id, children }: PropsWithChildren<{ id: string }>) => {
  const entry = useEntry(id)
  const feedId = entry?.feedId
  const view = useSelectedView()
  const isEntryStarred = useIsEntryStarred(id)

  const handlePressPreview = useCallback(() => {
    if (!entry) return
    setWebViewEntry(entry)
    router.push(`/entries/${id}`)
  }, [entry, id])

  if (!entry) return null

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>

      <ContextMenu.Content>
        <ContextMenu.Preview size="STRETCH" onPress={handlePressPreview}>
          {() => (
            <PortalHost>
              <View className="bg-system-background flex-1">
                <Text className="text-label mt-5 p-4 text-2xl font-semibold" numberOfLines={2}>
                  {entry.title?.trim()}
                </Text>
                <EntryContentWebView entry={entry} />
              </View>
            </PortalHost>
          )}
        </ContextMenu.Preview>

        <ContextMenu.Item
          key="MarkAsRead"
          onSelect={() => {
            unreadSyncService.markEntryAsRead(id)
          }}
        >
          <ContextMenu.ItemTitle>Mark as Read</ContextMenu.ItemTitle>
          <ContextMenu.ItemIcon
            ios={{
              name: "checkmark",
            }}
          />
        </ContextMenu.Item>

        {feedId && view !== undefined && (
          <ContextMenu.Item
            key="Star"
            onSelect={() => {
              if (isEntryStarred) {
                collectionSyncService.unstarEntry(id)
                toast.info("Unstarred")
              } else {
                collectionSyncService.starEntry({
                  feedId,
                  entryId: id,
                  view,
                })
                toast.info("Starred")
              }
            }}
          >
            <ContextMenu.ItemIcon
              ios={{
                name: isEntryStarred ? "star.slash" : "star",
              }}
            />
            <ContextMenu.ItemTitle>{isEntryStarred ? "Unstar" : "Star"}</ContextMenu.ItemTitle>
          </ContextMenu.Item>
        )}

        {entry.url && (
          <ContextMenu.Item
            key="OpenLink"
            onSelect={() => {
              if (!entry.url) return
              openLink(entry.url)
            }}
          >
            <ContextMenu.ItemIcon
              ios={{
                name: "link",
              }}
            />
            <ContextMenu.ItemTitle>Open Link</ContextMenu.ItemTitle>
          </ContextMenu.Item>
        )}

        {entry.url && (
          <ContextMenu.Item
            key="Share"
            onSelect={async () => {
              if (!entry.url) return
              await Share.share({
                message: entry.url,
                url: entry.url,
                title: entry.title || "Shared Link",
              })
            }}
          >
            <ContextMenu.ItemIcon
              ios={{
                name: "square.and.arrow.up",
              }}
            />
            <ContextMenu.ItemTitle>Share</ContextMenu.ItemTitle>
          </ContextMenu.Item>
        )}
      </ContextMenu.Content>
    </ContextMenu.Root>
  )
}
