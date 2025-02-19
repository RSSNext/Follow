import TrackPlayer, { State, useActiveTrack, usePlaybackState } from "react-native-track-player"

import type { AttachmentsModel } from "../database/schemas/types"

const LOADING_SUFFIX = "_loading"

export function usePlayingUrl() {
  const activeTrack = useActiveTrack()
  const playerState = usePlaybackState()
  const isPlaying = !!activeTrack?.url && playerState.state === State.Playing
  const isLoading = playerState.state === State.Buffering || playerState.state === State.Loading
  return isPlaying ? activeTrack?.url : isLoading ? `${activeTrack?.url}${LOADING_SUFFIX}` : null
}

export function getAttachmentState(playingUrl?: string, attachment?: AttachmentsModel) {
  if (!playingUrl || !attachment || !attachment.mime_type?.startsWith("audio/")) {
    return null
  }
  const isPlaying = attachment.url === playingUrl
  const isLoading = playingUrl === `${attachment.url}${LOADING_SUFFIX}`
  return isPlaying ? "playing" : isLoading ? "loading" : null
}

export async function play(newTrack?: {
  url: string
  title?: string | null
  artist?: string | null
  artwork?: string | null
}) {
  if (newTrack) {
    const activeTrack = await TrackPlayer.getActiveTrack()
    if (activeTrack?.url !== newTrack.url) {
      const { url, title, artist, artwork } = newTrack

      await TrackPlayer.load({
        url,
        title: title ?? "Unknown Title",
        artist: artist ?? "Unknown Artist",
        artwork: artwork ?? undefined,
      })
    }
  }

  await TrackPlayer.play()
}

export async function pause() {
  await TrackPlayer.pause()
}

export async function reset() {
  await TrackPlayer.reset()
}

export async function seekBy(offset: number) {
  await TrackPlayer.seekBy(offset)
}

export async function seekTo(position: number) {
  await TrackPlayer.seekTo(position)
}

export { useActiveTrack, useIsPlaying, useProgress } from "react-native-track-player"
