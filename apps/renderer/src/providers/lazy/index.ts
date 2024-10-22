import { lazy } from "react"

const LazyLottieRenderContainer = lazy(() =>
  import("../../components/ui/lottie-container").then((res) => ({
    default: res.LottieRenderContainer,
  })),
)
const LazyContextMenuProvider = lazy(() =>
  import("./../context-menu-provider").then((res) => ({
    default: res.ContextMenuProvider,
  })),
)
const LazyModalStackProvider = lazy(() =>
  import("../../components/ui/modal/stacked/provider").then((res) => ({
    default: res.ModalStackProvider,
  })),
)

const LazyExtensionExposeProvider = lazy(() =>
  import("./../extension-expose-provider").then((res) => ({
    default: res.ExtensionExposeProvider,
  })),
)

export {
  LazyContextMenuProvider,
  LazyExtensionExposeProvider,
  LazyLottieRenderContainer,
  LazyModalStackProvider,
}

const LazyExternalJumpInProvider = lazy(() =>
  import("../external-jump-in-provider").then((res) => ({
    default: res.ExternalJumpInProvider,
  })),
)
export { LazyExternalJumpInProvider }
