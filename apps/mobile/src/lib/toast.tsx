import { requireNativeModule } from "expo"
import { Platform } from "react-native"

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

interface NativeToasterOptions {
  title: string
  message: string
  type: "error" | "success" | "info" | "warn"
  /**
   * seconds
   */
  duration?: number
}
export const toast = {
  show: toastInstance.show.bind(toastInstance),
} as Toast
;(["error", "success", "info"] as const).forEach((type) => {
  toast[type] = (message: string, options: CommandToastOptions = {}) => {
    if (Platform.OS === "ios") {
      const NativeToaster = requireNativeModule("Toaster")
      NativeToaster.toast({
        title: "",
        message,
        type,
        duration: options.duration ? options.duration / 1000 : 1.5,
      } as NativeToasterOptions)
      return
    }

    toastInstance.show({
      type,
      message,
      variant: "center-replace",
      ...options,
    })
  }
})
