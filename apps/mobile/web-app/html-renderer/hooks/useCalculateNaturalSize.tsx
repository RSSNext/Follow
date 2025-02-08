import { useCallback, useReducer } from "react"

export const calculateDimensions = ({
  width,
  height,
  max,
}: {
  width: number
  height: number
  max: { width: number; height: number }
}) => {
  if (width === 0 || height === 0) return { width: 0, height: 0 }

  const { width: maxW, height: maxH } = max

  const wRatio = maxW / width || 1
  const hRatio = maxH / height || 1

  const ratio = Math.min(wRatio, hRatio, 1)

  return {
    width: width * ratio,
    height: height * ratio,
  }
}

const initialState = { height: 0, width: 0 }
type Action = { type: "set"; height: number; width: number } | { type: "reset" }
export const useCalculateNaturalSize = () => {
  const [state, dispatch] = useReducer((state: typeof initialState, payload: Action) => {
    switch (payload.type) {
      case "set": {
        return {
          height: payload.height,
          width: payload.width,
        }
      }
      case "reset": {
        return initialState
      }
      default: {
        return state
      }
    }
  }, initialState)

  const calculateOnImageEl = useCallback((imageEl: HTMLImageElement, parentElWidth?: number) => {
    if (!parentElWidth || !imageEl) {
      return
    }

    const w = imageEl.naturalWidth,
      h = imageEl.naturalHeight
    if (w && h) {
      const calculated = calculateDimensions({
        width: w,
        height: h,
        max: {
          height: Infinity,
          width: +parentElWidth,
        },
      })

      dispatch({
        type: "set",
        height: calculated.height,
        width: calculated.width,
      })
    }
  }, [])

  return [state, calculateOnImageEl] as const
}
