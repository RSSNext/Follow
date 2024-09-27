import { detectBrowser, getOS } from "./utils"

export const getCurrentEnvironment = () => {
  const ua = navigator.userAgent
  const appVersion = APP_VERSION
  const env = window.electron ? "electron" : "web"
  const os = getOS()
  const browser = detectBrowser()

  return [
    "### Environment",
    "",
    `**App Version**: ${appVersion}`,
    `**OS**: ${os}`,
    `**User Agent**: ${ua}`,
    `**Env**: ${env}`,
    `**Browser**: ${browser}`,
  ]
}
