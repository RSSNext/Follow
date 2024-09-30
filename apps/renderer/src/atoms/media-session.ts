import { atom } from "jotai"
import { useEffect } from "react"

import { createAtomHooks } from "~/lib/jotai"

export const [, , useMediaMetadataValue, useMediaMetadataSetValue] = createAtomHooks(
  atom<MediaMetadata | null>(null),
)

export const useNowPlaying = () => {
  const mediaMetadata = useMediaMetadataValue()

  useEffect(() => {
    if ("mediaSession" in navigator && mediaMetadata) {
      navigator.mediaSession.metadata = mediaMetadata
    }
  }, [mediaMetadata])
}
