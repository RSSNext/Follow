import type { NativeModule } from "expo"
import { requireNativeModule } from "expo"

export { default as ListView } from "./ListView"
export { default as SharedWebView } from "./SharedWebView"
export { default as TableView } from "./TableView"

declare class ISharedWebViewModule extends NativeModule {
  preload(url: string): void
}

export const SharedWebViewModule = requireNativeModule<ISharedWebViewModule>("FOSharedWebView")
