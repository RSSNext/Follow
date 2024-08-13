import * as Slider from "@radix-ui/react-slider"
import { useRefValue } from "@renderer/hooks/common"
import type { HTMLMediaState } from "@renderer/hooks/common/factory/createHTMLMediaHook"
import { useVideo } from "@renderer/hooks/common/useVideo"
import { cn } from "@renderer/lib/utils"
import { AnimatePresence, m } from "framer-motion"
import type { PropsWithChildren } from "react"
import { forwardRef, useImperativeHandle, useState } from "react"
import { useEventCallback } from "usehooks-ts"

import { MotionButtonBase } from "../button"

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
}
export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  ({ src, className, ...rest }, ref) => {
    const handleClick: React.MouseEventHandler<HTMLDivElement> =
    useEventCallback((e) => {
      e.stopPropagation()

      if (state.playing) {
        controls.pause()
      } else {
        controls.play()
      }
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

    const stateRef = useRefValue(state)
    const memoedControls = useState(controls)[0]

    useImperativeHandle(
      ref,
      () => ({
        getElement: () => videoRef.current,
        getState: () => stateRef.current,
        controls: memoedControls,
      }),

      [stateRef, videoRef, memoedControls],
    )

    return (
      <div className="relative" onClick={handleClick}>
        {element}
        {rest.controls && (
          <div
            className={cn(
              "absolute inset-x-2 bottom-2 h-8 rounded-2xl bg-neutral-700/90 backdrop-blur-xl",
              "flex items-center gap-3 px-3",
            )}
          >
            <MotionButtonBase
              className="center flex"
              onClick={() => {
                if (state.paused) {
                  controls.play()
                } else {
                  controls.pause()
                }
              }}
            >
              <AnimatePresence mode="popLayout">
                {state.paused ? (
                  <m.i
                    className="i-mgc-play-cute-fi"
                    key="play"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  />
                ) : (
                  <m.i
                    className="i-mgc-pause-cute-fi"
                    key="pause"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  />
                )}
              </AnimatePresence>
            </MotionButtonBase>

            {/* Progress bar */}
            {/* slider */}

            <Slider.Root
              className="relative flex h-1 w-full items-center transition-all duration-200 ease-in-out"
              min={0}
              max={state.duration}
              step={0.01}
              value={[state.time]}
              onPointerDown={() => {
                if (state.playing) {
                  controls.pause()
                }
              }}
              onValueChange={(value) => {
                controls.seek(value[0])
              }}
              onValueCommit={() => {
                controls.play()
              }}
            >
              <Slider.Track className="relative h-1 w-full grow rounded bg-neutral-700">
                <Slider.Range className="absolute h-1 rounded bg-theme-accent/50" />
              </Slider.Track>

              {/* indicator */}
              <Slider.Thumb
                className="block h-3 w-[3px] rounded-[1px] bg-theme-accent"
                aria-label="Progress"
              />
            </Slider.Root>
          </div>
        )}
      </div>
    )
  },
)
