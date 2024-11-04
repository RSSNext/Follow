import { getCurrentEnvironment } from "@follow/utils/environment"
import { repository } from "@pkg"

interface IssueOptions {
  title: string
  body: string
  label: string
  error?: Error
}
export const getNewIssueUrl = ({ body, label, title, error }: Partial<IssueOptions> = {}) => {
  const baseUrl = `${repository.url}/issues/new`

  const searchParams = new URLSearchParams()

  let nextBody = [body || "", "", ...getCurrentEnvironment()].join("\n")
  if (label) searchParams.set("label", label)
  if (title) searchParams.set("title", title)

  if (error && "traceId" in error && error.traceId) {
    nextBody += `\n\n### Sentry Trace ID\n${error.traceId}`
  }

  searchParams.set("body", nextBody)
  return `${baseUrl}?${searchParams.toString()}`
}
