import "vite/client"
import "../../../../packages/types/react-global"
import "../../../../packages/types/global"

interface Bridge {
  measure: () => void
  setContentHeight: (height: number) => void
}

declare global {
  interface Window {
    webkit: Bridge
  }
}

export {}
