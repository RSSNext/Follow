import type { NativeModule } from "expo"
import { requireNativeModule } from "expo-modules-core"

import { htmlUrl } from "./constants"

declare class ISharedWebViewModule extends NativeModule {
  load(url: string): void
  evaluateJavaScript(js: string): void
}

export const SharedWebViewModule = requireNativeModule<ISharedWebViewModule>("FOSharedWebView")

export const prepareEntryRenderWebView = () => {
  SharedWebViewModule.load(htmlUrl)
}
