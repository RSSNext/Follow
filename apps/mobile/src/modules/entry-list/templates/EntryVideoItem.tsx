import { openVideo } from "@follow/utils"

import { useGeneralSettingKey } from "@/src/atoms/settings/general"
import { MediaCarousel } from "@/src/components/ui/carousel/MediaCarousel"
import { ItemPressable } from "@/src/components/ui/pressable/ItemPressable"
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
          AccessoryProps={{ id }}
          noPreview={true}
        />
      </ItemPressable>
    </VideoContextMenu>
  )
}
