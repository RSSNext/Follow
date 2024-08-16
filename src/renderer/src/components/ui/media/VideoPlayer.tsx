import * as Slider from "@radix-ui/react-slider"
import { IconScaleTransition } from "@renderer/components/ux/transition/icon"
import { useRefValue } from "@renderer/hooks/common"
import type { HTMLMediaState } from "@renderer/hooks/common/factory/createHTMLMediaHook"
import { useVideo } from "@renderer/hooks/common/useVideo"
import { nextFrame, stopPropagation } from "@renderer/lib/dom"
import { cn } from "@renderer/lib/utils"
import { m, useDragControls, useSpring } from "framer-motion"
import type { PropsWithChildren } from "react"
import {
  forwardRef,
  memo,
  startTransition,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import { useHotkeys } from "react-hotkeys-hook"
import {
  createContext,
  useContext,
  useContextSelector,
} from "use-context-selector"
import { useEventCallback } from "usehooks-ts"

import { MotionButtonBase } from "../button"
import { softSpringPreset } from "../constants/spring"
import { KbdCombined } from "../kbd/Kbd"
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip"
import { VolumeSlider } from "./VolumeSlider"

type VideoPlayerProps = {
  src: string
} & React.VideoHTMLAttributes<HTMLVideoElement> &
PropsWithChildren
export type VideoPlayerRef = {
  getElement: () => HTMLVideoElement | null

  getState: () => HTMLMediaState
  controls: {
    play: () => Promise<void> | undefined
    pause: () => void
    seek: (time: number) => void
    volume: (volume: number) => void
    mute: () => void
    unmute: () => void
  }

  wrapperRef: React.RefObject<HTMLDivElement>
}

interface VideoPlayerContextValue {
  state: HTMLMediaState
  controls: VideoPlayerRef["controls"]
  wrapperRef: React.RefObject<HTMLDivElement>
  src: string
}
const VideoPlayerContext = createContext<VideoPlayerContextValue>(null!)
export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  ({ src, className, ...rest }, ref) => {
    const [clickToStatus, setClickToStatus] = useState(
      null as "play" | "pause" | null,
    )

    const scaleValue = useSpring(1, softSpringPreset)
    const opacityValue = useSpring(0, softSpringPreset)
    const handleClick = useEventCallback((e?: any) => {
      if (!rest.controls) return
      e?.stopPropagation()

      if (state.playing) {
        controls.pause()
        setClickToStatus("pause")
      } else {
        controls.play()
        setClickToStatus("play")
      }

      opacityValue.jump(1)
      scaleValue.jump(1)

      nextFrame(() => {
        scaleValue.set(1.3)
        opacityValue.set(0)
      })
    })

    const [element, state, controls, videoRef] = useVideo({
      src,
      className,
      playsInline: true,
      ...rest,
      controls: false,
      onClick(e) {
        rest.onClick?.(e)
        handleClick(e)
      },
    })

    useHotkeys("space", (e) => {
      e.preventDefault()
      handleClick()
    })

    const stateRef = useRefValue(state)
    const memoedControls = useState(controls)[0]
    const wrapperRef = useRef<HTMLDivElement>(null)
    useImperativeHandle(
      ref,
      () => ({
        getElement: () => videoRef.current,
        getState: () => stateRef.current,
        controls: memoedControls,
        wrapperRef,
      }),

      [stateRef, videoRef, memoedControls],
    )

    return (
      <div className="center relative size-full" ref={wrapperRef}>
        {element}

        <div className="center pointer-events-none absolute inset-0">
          <m.div
            className="center flex size-20 rounded-full bg-black p-3"
            style={{ scale: scaleValue, opacity: opacityValue }}
          >
            <i
              className={cn(
                "size-8 text-white",
                clickToStatus === "play" ?
                  "i-mgc-play-cute-fi" :
                  "i-mgc-pause-cute-fi",
              )}
            />
          </m.div>
        </div>

        <VideoPlayerContext.Provider
          value={useMemo(
            () => ({ state, controls, wrapperRef, src }),
            [state, controls, src],
          )}
        >
          {rest.controls && <ControlBar />}
        </VideoPlayerContext.Provider>
      </div>
    )
  },
)

const ControlBar = memo(() => {
  const controls = useContextSelector(VideoPlayerContext, (v) => v.controls)
  const isPaused = useContextSelector(
    VideoPlayerContext,
    (v) => v.state.paused,
  )
  const dragControls = useDragControls()

  return (
    <m.div
      onClick={stopPropagation}
      drag
      dragListener={false}
      dragControls={dragControls}
      dragElastic={0}
      dragMomentum={false}
      dragConstraints={{ current: document.documentElement }}
      className={cn(
        "absolute inset-x-2 bottom-2 h-8 rounded-2xl bg-neutral-700/90 backdrop-blur-xl",
        "flex items-center gap-3 px-3",
      )}
    >
      {/* Drag Area */}
      <div
        onPointerDownCapture={dragControls.start.bind(dragControls)}
        className="absolute inset-0 z-[1]"
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <MotionButtonBase
            className="center relative z-[1] flex"
            onClick={() => {
              if (isPaused) {
                controls.play()
              } else {
                controls.pause()
              }
            }}
          >
            <IconScaleTransition
              status={isPaused ? "init" : "done"}
              icon1="i-mgc-play-cute-fi"
              icon2="i-mgc-pause-cute-fi"
            />
          </MotionButtonBase>
        </TooltipTrigger>
        <TooltipContent className="flex items-center gap-1 bg-theme-modal-background">
          {isPaused ? "Play" : "Pause"}
          <KbdCombined>Space</KbdCombined>
        </TooltipContent>
      </Tooltip>

      {/* Progress bar */}
      <PlayProgressBar />

      {/* Right Action */}
      <m.div className="relative z-[1] flex items-center gap-1">
        <VolumeControl />
        <DownloadVideo />
        <FullScreenControl />
      </m.div>
    </m.div>
  )
})

const FullScreenControl = () => {
  const ref = useContextSelector(VideoPlayerContext, (v) => v.wrapperRef)
  const [isFullScreen, setIsFullScreen] = useState(false)
  return (
    <ActionIcon
      label="Full Screen"
      shortcut="f"
      labelDelayDuration={1}
      onClick={() => {
        if (!ref.current) return

        if (isFullScreen) {
          document.exitFullscreen()
        } else {
          ref.current.requestFullscreen()
        }

        setIsFullScreen((v) => !v)
      }}
    >
      <i className="i-mgc-fullscreen-2-cute-re" />
    </ActionIcon>
  )
}

const DownloadVideo = () => {
  const src = useContextSelector(VideoPlayerContext, (v) => v.src)
  const [isDownloading, setIsDownloading] = useState(false)
  const download = useEventCallback(() => {
    setIsDownloading(true)
    fetch(src)
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = src.split("/").pop()!
        a.click()
        URL.revokeObjectURL(url)
        setIsDownloading(false)
      })
  })

  return (
    <ActionIcon
      shortcut="d"
      label="Download"
      labelDelayDuration={1}
      onClick={download}
    >
      {isDownloading ? (
        <i className="i-mgc-loading-3-cute-re animate-spin" />
      ) : (
        <i className="i-mgc-download-2-cute-re" />
      )}
    </ActionIcon>
  )
}
const VolumeControl = () => {
  const hasAudio = useContextSelector(
    VideoPlayerContext,
    (v) => v.state.hasAudio,
  )

  const controls = useContextSelector(VideoPlayerContext, (v) => v.controls)
  const volume = useContextSelector(VideoPlayerContext, (v) => v.state.volume)
  const muted = useContextSelector(VideoPlayerContext, (v) => v.state.muted)
  if (!hasAudio) return null
  return (
    <ActionIcon
      label={<VolumeSlider onVolumeChange={controls.volume} volume={volume} />}
      shortcut="m"
      onClick={() => {
        if (muted) {
          controls.unmute()
        } else {
          controls.mute()
        }
      }}
      labelDelayDuration={1}
    >
      {muted ? (
        <i className="i-mgc-volume-mute-cute-re" />
      ) : (
        <i className="i-mgc-volume-cute-re" />
      )}
    </ActionIcon>
  )
}

const PlayProgressBar = () => {
  const { state, controls } = useContext(VideoPlayerContext)
  const [currentDragging, setCurrentDragging] = useState(false)
  const [dragTime, setDragTime] = useState(0)

  useHotkeys("left", (e) => {
    e.preventDefault()
    controls.seek(state.time - 5)
  })

  useHotkeys("right", (e) => {
    e.preventDefault()
    controls.seek(state.time + 5)
  })
  return (
    <Slider.Root
      className="relative z-[1] flex size-full items-center transition-all duration-200 ease-in-out"
      min={0}
      max={state.duration}
      step={0.01}
      value={[currentDragging ? dragTime : state.time]}
      onPointerDown={() => {
        if (state.playing) {
          controls.pause()
        }
        setDragTime(state.time)
        setCurrentDragging(true)
      }}
      onValueChange={(value) => {
        setDragTime(value[0])
        startTransition(() => {
          controls.seek(value[0])
        })
      }}
      onValueCommit={() => {
        controls.play()
        setCurrentDragging(false)
        controls.seek(dragTime)
      }}
    >
      <Slider.Track className="relative h-1 w-full grow rounded bg-neutral-800">
        <Slider.Range className="absolute h-1 rounded bg-neutral-600" />
      </Slider.Track>

      {/* indicator */}
      <Slider.Thumb
        className="block h-3 w-[3px] rounded-[1px] bg-zinc-400"
        aria-label="Progress"
      />
    </Slider.Root>
  )
}

const ActionIcon = ({
  className,
  onClick,
  label,
  labelDelayDuration = 700,
  children,
  shortcut,
}: {
  className?: string
  onClick?: () => void
  label: React.ReactNode
  labelDelayDuration?: number
  children?: React.ReactNode
  shortcut?: string
}) => {
  useHotkeys(
    shortcut || "",
    (e) => {
      e.preventDefault()
      onClick?.()
    },
    {
      enabled: !!shortcut,
    },
  )
  return (
    <Tooltip delayDuration={labelDelayDuration}>
      <TooltipTrigger>
        <button
          type="button"
          className="center size-6 rounded-md hover:bg-theme-button-hover"
          onClick={onClick}
        >
          {children || <i className={className} />}
        </button>
      </TooltipTrigger>
      <TooltipContent className="flex items-center gap-1 bg-theme-modal-background">
        {label}
        {shortcut && <KbdCombined>{shortcut}</KbdCombined>}
      </TooltipContent>
    </Tooltip>
  )
}
