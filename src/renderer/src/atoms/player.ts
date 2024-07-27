import { createAtomHooks } from "@renderer/lib/jotai"
import { getStorageNS } from "@renderer/lib/ns"
import { atomWithStorage, createJSONStorage } from "jotai/utils"
import type { SyncStorage } from "jotai/vanilla/utils/atomWithStorage"

type PlayerAtomValue = {
  show: boolean
  type?: "audio"
  entryId?: string
  src?: string
  status?: "playing" | "paused" | "loading"
  duration?: number
  currentTime?: number
  isMute?: boolean
  volume?: number
  playbackRate?: number
}

const playerInitialValue: PlayerAtomValue = {
  show: false,
  volume: 0.8,
  duration: 0,
  playbackRate: 1,
}

const jsonStorage = createJSONStorage<PlayerAtomValue>()
const patchedLocalStorage: SyncStorage<PlayerAtomValue> = {
  setItem: jsonStorage.setItem,
  getItem: (key, initialValue) => {
    const value = jsonStorage.getItem(key, initialValue)
    if (value) {
      // patch status to `paused` when hydration
      value.status = "paused"
    }
    return value
  },
  removeItem: jsonStorage.removeItem,
}
export const [
  ,
  ,
  usePlayerAtomValue,
  useSetPlayerAtom,
  getPlayerAtomValue,
  setPlayerAtomValue,
  usePlayerAtomSelector,
] = createAtomHooks<PlayerAtomValue>(
  atomWithStorage(
    getStorageNS("player"),
    playerInitialValue,
    patchedLocalStorage,
    {
      getOnInit: true,
    },
  ),
)

export const Player = {
  audio: new Audio(),
  currentTimeTimer: null as NodeJS.Timeout | null,
  get() {
    return getPlayerAtomValue()
  },
  mount(
    v: Omit<PlayerAtomValue, "show" | "status" | "playedSeconds" | "duration">,
  ) {
    const curV = getPlayerAtomValue()
    if (!v.src || (curV.src === v.src && curV.status === "playing")) {
      return
    }

    setPlayerAtomValue({
      ...curV,
      ...v,
      status: "loading",
      show: true,
    })

    if (this.audio.src !== v.src) {
      this.audio.src = v.src
      this.audio.currentTime = v.currentTime ?? curV.currentTime ?? 0
    }
    this.audio.volume = curV.volume ?? 0.8
    this.audio.playbackRate = curV.playbackRate ?? 1

    this.currentTimeTimer && clearInterval(this.currentTimeTimer)
    this.currentTimeTimer = setInterval(() => {
      setPlayerAtomValue({
        ...getPlayerAtomValue(),
        currentTime: this.audio.currentTime,
      })
    }, 1000)

    return this.audio.play().then(() => {
      setPlayerAtomValue({
        ...getPlayerAtomValue(),
        status: "playing",
        duration: this.audio.duration,
      })
    })
  },
  teardown() {
    this.currentTimeTimer && clearInterval(this.currentTimeTimer)
    this.audio.pause()
  },
  play() {
    const curV = getPlayerAtomValue()

    this.mount(curV)
  },
  pause() {
    const curV = getPlayerAtomValue()
    if (curV.status === "paused") {
      return
    }

    setPlayerAtomValue({
      ...curV,
      status: "paused",
      currentTime: this.audio.currentTime,
    })
    this.teardown()
    return
  },
  togglePlayAndPause() {
    const curV = getPlayerAtomValue()
    if (curV.status === "playing") {
      return this.pause()
    } else if (curV.status === "paused") {
      return this.mount(curV)
    } else {
      return this.pause()
    }
  },
  close() {
    setPlayerAtomValue({
      ...getPlayerAtomValue(),
      show: false,
      status: "paused",
    })

    this.teardown()
  },
  seek(time: number) {
    this.audio.currentTime = time
    setPlayerAtomValue({
      ...getPlayerAtomValue(),
      currentTime: time,
    })
  },
  setPlaybackRate(speed: number) {
    this.audio.playbackRate = speed
    setPlayerAtomValue({
      ...getPlayerAtomValue(),
      playbackRate: speed,
    })
  },
  back(time: number) {
    this.seek(Math.max(this.audio.currentTime - time, 0))
  },
  forward(time: number) {
    this.seek(Math.min(this.audio.currentTime + time, this.audio.duration))
  },
  toggleMute() {
    this.audio.muted = !this.audio.muted
    setPlayerAtomValue({
      ...getPlayerAtomValue(),
      isMute: this.audio.muted,
    })
  },
  setVolume(volume: number) {
    this.audio.volume = volume
    setPlayerAtomValue({
      ...getPlayerAtomValue(),
      volume,
    })
  },
}

window.play = Player
