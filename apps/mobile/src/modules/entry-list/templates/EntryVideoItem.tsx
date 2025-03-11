import { transformVideoUrl } from "@follow/utils"
import { Linking } from "react-native"

import { useGeneralSettingKey } from "@/src/atoms/settings/general"
import { MediaCarousel } from "@/src/components/ui/carousel/MediaCarousel"
import { ItemPressable } from "@/src/components/ui/pressable/ItemPressable"
import { openLink } from "@/src/lib/native"
import { toast } from "@/src/lib/toast"
import { useEntry } from "@/src/store/entry/hooks"
import { unreadSyncService } from "@/src/store/unread/store"

import { VideoContextMenu } from "../../context-menu/video"

export function EntryVideoItem({ id }: { id: string }) {
  const item = useEntry(id)
  const needOpenVideoInApp = useGeneralSettingKey("openVideoInApp")

  if (!item || !item.media) {
    return null
  }

  const firstMedia = item.media.slice(0, 1)

  return (
    <VideoContextMenu entryId={id}>
      <ItemPressable
        className="m-1 overflow-hidden rounded-md"
        onPress={() => {
          unreadSyncService.markEntryAsRead(id)
          if (!item.url) {
            toast.error("No video URL found")
            return
          }
          openVideo(item.url, needOpenVideoInApp)
        }}
      >
        <MediaCarousel
          entryId={id}
          media={firstMedia}
          aspectRatio={16 / 9}
          // AccessoryProps={{ id }}
          noPreview={true}
        />
      </ItemPressable>
    </VideoContextMenu>
  )
}

const parseSchemeLink = (url: string) => {
  let urlObject: URL
  try {
    urlObject = new URL(url)
  } catch {
    return null
  }

  switch (urlObject.hostname) {
    case "www.bilibili.com": {
      // bilibili://video/{av}or{bv}
      const bvid = urlObject.pathname.match(/video\/(BV\w+)/)?.[1]
      return bvid ? `bilibili://video/${bvid}` : null
    }
    case "www.youtube.com": {
      // youtube://watch?v=xxx
      const videoId = urlObject.searchParams.get("v")
      return videoId ? `youtube://watch?v=${videoId}` : null
    }
    default: {
      return null
    }
  }
}

const openVideo = async (url: string, openVideoInApp = false) => {
  if (openVideoInApp) {
    const schemeLink = parseSchemeLink(url)
    try {
      const isInstalled = !!schemeLink && (await Linking.canOpenURL(schemeLink))
      if (schemeLink && isInstalled) {
        await Linking.openURL(schemeLink)
        return
      }
    } catch {
      // Ignore error
    }
  }

  // Fallback to opening in in-app browser
  const formattedUrl = transformVideoUrl({ url }) || url
  openLink(formattedUrl)
}
