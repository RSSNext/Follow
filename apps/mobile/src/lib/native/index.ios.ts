import { requireNativeModule } from "expo"

interface NativeModule {
  openLink: (url: string) => void
}
const nativeModule = requireNativeModule("Helper") as NativeModule
export const openLink = (url: string) => {
  nativeModule.openLink(url)
}
