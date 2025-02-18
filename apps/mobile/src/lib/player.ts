import TrackPlayer, { State, useActiveTrack, usePlaybackState } from "react-native-track-player"

export function usePlayingUrl() {
  const activeTrack = useActiveTrack()
  const playerState = usePlaybackState()
  const isPlaying = !!activeTrack?.url && playerState.state === State.Playing
  const isLoading = playerState.state === State.Buffering || playerState.state === State.Loading
  return isPlaying ? activeTrack?.url : isLoading ? `${activeTrack?.url}_loading` : null
}

export async function play({
  url,
  title,
  artwork,
}: {
  url: string
  title?: string | null
  artwork?: string | null
}) {
  await TrackPlayer.load({
    url,
    title: title ?? "Unknown",
    artwork: artwork ?? undefined,
  })
  const { state } = await TrackPlayer.getPlaybackState()
  if (state !== State.Playing) {
    await TrackPlayer.play()
  }
}

export async function pause() {
  await TrackPlayer.pause()
}
