import { ActionButton } from "@follow/components/ui/button/index.js"
import type { MediaModel } from "@follow/models"

import { useModalStack } from "~/components/ui/modal/stacked/hooks"
import { filterSmallMedia } from "~/lib/utils"
import { useEntry } from "~/store/entry"

import { ImageGallery } from "./picture-gallery"

export const ImageGalleryAction = ({ id }: { id: string }) => {
  const images = useEntry(id, (entry) => entry.entries.media)
  const { present } = useModalStack()
  const filteredImages = filterSmallMedia(images)
  if (filteredImages?.length && filteredImages.length > 5) {
    return (
      <ActionButton
        onClick={() => {
          window.analytics?.capture("entry_content_header_image_gallery_click")
          present({
            title: "Image Gallery",
            content: () => <ImageGallery images={filteredImages as any as MediaModel[]} />,
            max: true,
            clickOutsideToDismiss: true,
          })
        }}
        icon={<i className="i-mgc-pic-cute-fi" />}
        tooltip={`Image Gallery`}
      />
    )
  }
  return null
}
