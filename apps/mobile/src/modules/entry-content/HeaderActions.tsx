import { useAtom } from "jotai"
import { Clipboard, Share, TouchableOpacity, View } from "react-native"
import type { SharedValue } from "react-native-reanimated"
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated"
import { useColor } from "react-native-uikit-colors"

import { ActionBarItem } from "@/src/components/ui/action-bar/ActionBarItem"
import { DropdownMenu } from "@/src/components/ui/context-menu"
import { Magic2CuteReIcon } from "@/src/icons/magic_2_cute_re"
import { More1CuteReIcon } from "@/src/icons/more_1_cute_re"
import { Share3CuteReIcon } from "@/src/icons/share_3_cute_re"
import { StarCuteFiIcon } from "@/src/icons/star_cute_fi"
import { StarCuteReIcon } from "@/src/icons/star_cute_re"
import { openLink } from "@/src/lib/native"
import { toast } from "@/src/lib/toast"
import { useIsEntryStarred } from "@/src/store/collection/hooks"
import { collectionSyncService } from "@/src/store/collection/store"
import { useEntry } from "@/src/store/entry/hooks"
import { useFeed } from "@/src/store/feed/hooks"
import { useSubscription } from "@/src/store/subscription/hooks"
import { summaryActions, summarySyncService } from "@/src/store/summary/store"

import { useEntryContentContext } from "./ctx"

export function EntryContentHeaderRightActions(props: HeaderRightActionsProps) {
  return <HeaderRightActionsImpl {...props} />
}

interface HeaderRightActionsProps {
  entryId: string
  titleOpacityShareValue: SharedValue<number>
  isHeaderTitleVisible: boolean
}
const HeaderRightActionsImpl = ({
  entryId,
  titleOpacityShareValue,
  isHeaderTitleVisible,
}: HeaderRightActionsProps) => {
  const labelColor = useColor("label")
  const isStarred = useIsEntryStarred(entryId)

  const entry = useEntry(entryId, (entry) => {
    if (!entry) return
    return {
      url: entry.url,
      feedId: entry.feedId,
      title: entry.title,
    }
  })
  const feed = useFeed(entry?.feedId as string, (feed) => {
    return {
      feedId: feed.id,
    }
  })
  const subscription = useSubscription(feed?.feedId as string)

  const handleToggleStar = () => {
    if (!entry) return
    if (!feed) return
    if (!subscription) return
    if (isStarred) collectionSyncService.unstarEntry(entryId)
    else
      collectionSyncService.starEntry({
        entryId,
        feedId: feed.feedId,
        view: subscription.view,
      })
  }

  const handleShare = () => {
    if (!entry) return
    Share.share({
      title: entry.title!,
      url: entry.url!,
    })
  }
  const { showAISummaryAtom } = useEntryContentContext()
  const [showAISummary, setShowAISummary] = useAtom(showAISummaryAtom)
  const handleAISummary = () => {
    if (!entry) return

    const getCachedOrGenerateSummary = async () => {
      const hasSummary = await summaryActions.getSummary(entryId)
      if (hasSummary) return
      await summarySyncService.generateSummary(entryId)
    }
    setShowAISummary((prev) => {
      const n = !prev
      if (n) {
        getCachedOrGenerateSummary()
      }
      return n
    })
  }

  return (
    <View className="relative flex-row gap-4">
      <Animated.View
        style={useAnimatedStyle(() => {
          return {
            opacity: interpolate(titleOpacityShareValue.value, [0, 1], [1, 0]),
          }
        })}
        className="absolute right-[32px] flex-row gap-2"
      >
        {!!subscription && (
          <ActionBarItem
            onPress={handleToggleStar}
            label={isStarred ? "Unstar" : "Star"}
            active={isStarred}
            iconColor={isStarred ? "#facc15" : undefined}
          >
            {isStarred ? <StarCuteFiIcon /> : <StarCuteReIcon />}
          </ActionBarItem>
        )}

        <ActionBarItem onPress={handleAISummary} label="Generate Summary" active={showAISummary}>
          <Magic2CuteReIcon />
        </ActionBarItem>

        <ActionBarItem onPress={handleShare} label="Share">
          <Share3CuteReIcon />
        </ActionBarItem>
      </Animated.View>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <TouchableOpacity hitSlop={10} accessibilityLabel="More Actions">
            <More1CuteReIcon color={labelColor} />
          </TouchableOpacity>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content>
          {isHeaderTitleVisible && (
            <DropdownMenu.Group>
              <DropdownMenu.Item key="Star" onSelect={handleToggleStar}>
                <DropdownMenu.ItemTitle>{isStarred ? "Unstar" : "Star"}</DropdownMenu.ItemTitle>
              </DropdownMenu.Item>
              <DropdownMenu.CheckboxItem
                value={showAISummary}
                key="Generate Summary"
                onSelect={handleAISummary}
              >
                <DropdownMenu.ItemTitle>Generate Summary</DropdownMenu.ItemTitle>
              </DropdownMenu.CheckboxItem>
              <DropdownMenu.Item key="Share" onSelect={handleShare}>
                <DropdownMenu.ItemTitle>Share</DropdownMenu.ItemTitle>
              </DropdownMenu.Item>
            </DropdownMenu.Group>
          )}
          <DropdownMenu.Item
            key="CopyLink"
            onSelect={() => {
              if (!entry?.url) return
              Clipboard.setString(entry.url)
              toast.info("Link copied to clipboard")
            }}
          >
            <DropdownMenu.ItemTitle>Copy Link</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            key="OpenInBrowser"
            onSelect={() => {
              if (!entry?.url) return
              openLink(entry.url)
            }}
          >
            <DropdownMenu.ItemTitle>Open in Browser</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </View>
  )
}
