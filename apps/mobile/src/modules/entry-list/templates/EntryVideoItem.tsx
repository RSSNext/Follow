import { transformVideoUrl } from "@follow/utils"

import { MediaCarousel } from "@/src/components/ui/carousel/MediaCarousel"
import { ItemPressable } from "@/src/components/ui/pressable/ItemPressable"
import { openLink } from "@/src/lib/native"
import { useEntry } from "@/src/store/entry/hooks"
import { unreadSyncService } from "@/src/store/unread/store"

import { VideoContextMenu } from "../../context-menu/video"

export function EntryVideoItem({ id }: { id: string }) {
  const item = useEntry(id)

  if (!item || !item.media) {
    return null
  }

  const firstMedia = item.media[0]!

  return (
    <VideoContextMenu entryId={id}>
      <ItemPressable
        className="m-1 overflow-hidden rounded-md"
        onPress={() => {
          unreadSyncService.markEntryAsRead(id)
          if (!item.url) return
          const formattedUrl = transformVideoUrl({ url: item.url }) || item.url
          openLink(formattedUrl)
        }}
      >
        <MediaCarousel
          entryId={id}
          media={[firstMedia]}
          aspectRatio={16 / 9}
          AccessoryProps={{ id }}
          noPreview={true}
        />
      </ItemPressable>
    </VideoContextMenu>
  )
}
