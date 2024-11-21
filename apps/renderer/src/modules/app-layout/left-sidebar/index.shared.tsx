import { lazy } from "react"

export const ReloadPrompt = ELECTRON
  ? () => null
  : lazy(() =>
      import("~/components/common/ReloadPrompt").then((module) => ({
        default: module.ReloadPrompt,
      })),
    )
