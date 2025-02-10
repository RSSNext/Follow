import { PortalProvider } from "@gorhom/portal"
import { router } from "expo-router"
import type { PropsWithChildren } from "react"
import { useCallback } from "react"
import { Share, Text, View } from "react-native"
import * as ContextMenu from "zeego/context-menu"

import {
  EntryContentWebView,
  setWebViewEntry,
} from "@/src/components/native/webview/EntryContentWebView"
import { openLink } from "@/src/lib/native"
import { useIsEntryStared } from "@/src/store/collection/hooks"
import { collectionSyncService } from "@/src/store/collection/store"
import { useEntry } from "@/src/store/entry/hooks"
import { unreadSyncService } from "@/src/store/unread/store"

export const EntryItemContextMenu = ({ id, children }: PropsWithChildren<{ id: string }>) => {
  const entry = useEntry(id)
  const isEntryStared = useIsEntryStared(id)

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
            <PortalProvider>
              <View className="bg-system-background flex-1">
                <Text className="text-label mt-5 p-4 text-2xl font-semibold" numberOfLines={2}>
                  {entry.title}
                </Text>
                <EntryContentWebView entry={entry} />
              </View>
            </PortalProvider>
          )}
        </ContextMenu.Preview>

        <ContextMenu.Item
          key="MarkAsRead"
          onSelect={() => {
            unreadSyncService.markEntryAsRead(id)
          }}
        >
          <ContextMenu.ItemTitle>Mark As Read</ContextMenu.ItemTitle>
        </ContextMenu.Item>

        <ContextMenu.Item
          key="Star"
          onSelect={() => {
            if (isEntryStared) {
              collectionSyncService.unstarEntry({
                createdAt: new Date().toISOString(),
                feedId: entry.feedId,
                entryId: id,
                view: 0,
              })
              return
            } else {
              collectionSyncService.starEntry(
                {
                  createdAt: new Date().toISOString(),
                  feedId: entry.feedId,
                  entryId: id,
                  // TODO update view
                  view: 0,
                },
                0,
              )
            }
          }}
        >
          <ContextMenu.ItemTitle>{isEntryStared ? "Unstar" : "Star"}</ContextMenu.ItemTitle>
        </ContextMenu.Item>

        {entry.url && (
          <ContextMenu.Item
            key="OpenLink"
            onSelect={() => {
              if (!entry.url) return
              openLink(entry.url)
            }}
          >
            <ContextMenu.ItemTitle>Open link</ContextMenu.ItemTitle>
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
            <ContextMenu.ItemTitle>Share</ContextMenu.ItemTitle>
          </ContextMenu.Item>
        )}
      </ContextMenu.Content>
    </ContextMenu.Root>
  )
}
