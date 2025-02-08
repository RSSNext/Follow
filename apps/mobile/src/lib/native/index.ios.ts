import { requireNativeModule } from "expo"

interface NativeModule {
  openLink: (url: string) => void
  previewImage: (images: Uint8Array[]) => void
}
const nativeModule = requireNativeModule("Helper") as NativeModule
export const openLink = (url: string) => {
  nativeModule.openLink(url)
}
export const quickLookImage = (images: string[]) => {
  nativeModule.previewImage(images)
}
