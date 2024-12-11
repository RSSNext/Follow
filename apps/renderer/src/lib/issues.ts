import { getCurrentEnvironment } from "@follow/utils/environment"
import { repository } from "@pkg"

interface IssueOptions {
  title: string
  body: string
  label: string
  error?: Error
  target: "issue" | "discussion"
  category: string
}

export const getNewIssueUrl = ({
  body,
  label,
  title,
  error,
  target = "issue",
  category,
}: Partial<IssueOptions> = {}) => {
  const baseUrl =
    target === "discussion" ? `${repository.url}/discussions/new` : `${repository.url}/issues/new`

  const searchParams = new URLSearchParams()
  if (category) searchParams.set("category", category)

  let nextBody = [body || "", "", ...getCurrentEnvironment()].join("\n")
  if (label) searchParams.set("label", label)
  if (title) searchParams.set("title", title)

  if (error && "traceId" in error && error.traceId) {
    nextBody += `\n\n### Sentry Trace ID\n${error.traceId}`
  }

  searchParams.set("body", nextBody)
  return `${baseUrl}?${searchParams.toString()}`
}
