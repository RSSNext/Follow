import ImageEditor from "@react-native-community/image-editor"
import { setImageAsync } from "expo-clipboard"
import * as FileSystem from "expo-file-system"
import { saveToLibraryAsync } from "expo-media-library"
import { shareAsync } from "expo-sharing"
import type { PropsWithChildren } from "react"
import { Image } from "react-native"

import { toast } from "@/src/lib/toast"
import { useSelectedView } from "@/src/modules/screen/atoms"
import { useIsEntryStarred } from "@/src/store/collection/hooks"
import { collectionSyncService } from "@/src/store/collection/store"
import { useEntry } from "@/src/store/entry/hooks"

import { ContextMenu } from "../context-menu"

type ImageContextMenuProps = PropsWithChildren<{
  imageUrl?: string
  entryId?: string
}>

export const ImageContextMenu = ({ imageUrl, entryId, children }: ImageContextMenuProps) => {
  const entry = useEntry(entryId!)
  const feedId = entry?.feedId
  const view = useSelectedView()
  const isEntryStarred = useIsEntryStarred(entryId!)

  if (!imageUrl || !entry) {
    return children
  }

  const getImageData = async () => {
    const size = await Image.getSize(imageUrl)
    const croppedImage = await ImageEditor.cropImage(imageUrl, {
      offset: {
        x: 0,
        y: 0,
      },
      size,
      format: "png",
      includeBase64: true,
    })

    return croppedImage
  }

  const createTempFile = async (base64: string) => {
    const fileUri = await FileSystem.getInfoAsync(FileSystem.cacheDirectory!)
    const filename = `${imageUrl.split("/").pop()}.png`
    const filePath = `${fileUri.uri}/${filename}`
    await FileSystem.writeAsStringAsync(filePath, base64, {
      encoding: FileSystem.EncodingType.Base64,
    })

    return {
      filePath,
      cleanup: () => FileSystem.deleteAsync(filePath),
    }
  }
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      <ContextMenu.Content>
        {entryId && feedId && view !== undefined && (
          <ContextMenu.Item
            key="Star"
            onSelect={() => {
              if (isEntryStarred) {
                collectionSyncService.unstarEntry(entryId)
                toast.info("Unstarred")
              } else {
                collectionSyncService.starEntry({
                  feedId,
                  entryId,
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

        <ContextMenu.Item
          key="Copy"
          onSelect={async () => {
            const croppedImage = await getImageData()
            await setImageAsync(croppedImage.base64)
          }}
        >
          <ContextMenu.ItemIcon
            ios={{
              name: "document.on.document",
            }}
          />
          <ContextMenu.ItemTitle>Copy</ContextMenu.ItemTitle>
        </ContextMenu.Item>
        <ContextMenu.Item
          key="Save"
          onSelect={async () => {
            const croppedImage = await getImageData()
            const { filePath, cleanup } = await createTempFile(croppedImage.base64)
            await saveToLibraryAsync(filePath)
            toast.success("Image saved to library")
            cleanup()
          }}
        >
          <ContextMenu.ItemTitle>Save to Album</ContextMenu.ItemTitle>
          <ContextMenu.ItemIcon
            ios={{
              name: "square.and.arrow.down",
            }}
          />
        </ContextMenu.Item>
        <ContextMenu.Item
          key="Share"
          onSelect={async () => {
            const croppedImage = await getImageData()
            const { filePath, cleanup } = await createTempFile(croppedImage.base64)
            await shareAsync(filePath, {
              dialogTitle: "Share Image",
            })

            cleanup()
          }}
        >
          <ContextMenu.ItemIcon
            ios={{
              name: "square.and.arrow.up",
            }}
          />
          <ContextMenu.ItemTitle>Share</ContextMenu.ItemTitle>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  )
}
