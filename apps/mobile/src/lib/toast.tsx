import { ToastManager } from "../components/ui/toast/manager"
import type { ToastProps } from "../components/ui/toast/types"

export const toastInstance = new ToastManager()

type CommandToastOptions = Partial<Pick<ToastProps, "duration" | "icon" | "render" | "message">>
type Toast = {
  // [key in "error" | "success" | "info"]: (message: string) => void;
  show: typeof toastInstance.show
  error: (message: string, options?: CommandToastOptions) => void
  success: (message: string, options?: CommandToastOptions) => void
  info: (message: string, options?: CommandToastOptions) => void
}
export const toast = {
  show: toastInstance.show.bind(toastInstance),
} as Toast
;(["error", "success", "info"] as const).forEach((type) => {
  toast[type] = (message: string, options: CommandToastOptions = {}) => {
    toastInstance.show({
      type,
      message,
      variant: "center-replace",
      ...options,
    })
  }
})
