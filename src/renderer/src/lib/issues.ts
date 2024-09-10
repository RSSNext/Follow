import { repository } from "@pkg"

import { detectBrowser, getOS } from "./utils"

interface IssueOptions {
  title: string
  body: string
  label: string
}
export const getNewIssueUrl = ({ body, label, title }: Partial<IssueOptions> = {}) => {
  const baseUrl = `${repository.url}/issues/new`

  const searchParams = new URLSearchParams()

  const ua = navigator.userAgent
  const appVersion = APP_VERSION
  const env = window.electron ? "electron" : "web"
  const os = getOS()
  const browser = detectBrowser()

  const nextBody = [
    body || "",
    "",
    "### Environment",
    "",
    `**App Version**: ${appVersion}`,
    `**OS**: ${os}`,
    `**User Agent**: ${ua}`,
    `**Env**: ${env}`,
    `**Browser**: ${browser}`,
  ].join("\n")
  searchParams.set("body", nextBody)
  if (label) searchParams.set("label", label)
  if (title) searchParams.set("title", title)

  return `${baseUrl}?${searchParams.toString()}`
}
