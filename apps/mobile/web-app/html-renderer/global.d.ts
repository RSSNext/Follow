import "vite/client"
import "../../../../packages/types/react-global"
import "../../../../packages/types/global"

interface Bridge {
  measure: () => void
  setContentHeight: (height: number) => void
  previewImage: (data: { images: Uint8Array[]; index: number }) => void
}

declare global {
  export const bridge: Bridge
}

export {}
