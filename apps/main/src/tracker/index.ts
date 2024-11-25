import { op } from "~/lib/op"

const PREFIX = "app:"
export const hotUpdateDownloadTrack = (version: string) => {
  op.track(`${PREFIX}hot-update-download`, { version })
}
export const hotUpdateAppNotSupportTriggerTrack = (data: {
  appVersion: string
  manifestVersion: string
}) => {
  op.track(`${PREFIX}hot-update-app-not-support-trigger`, data)
}

export const hotUpdateRenderSuccessTrack = (version: string) => {
  op.track(`${PREFIX}hot-update-render-success`, { version })
}
