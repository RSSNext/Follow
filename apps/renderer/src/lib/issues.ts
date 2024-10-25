import { getCurrentEnvironment } from "@follow/utils/environment"
import { repository } from "@pkg"

interface IssueOptions {
  title: string
  body: string
  label: string
}
export const getNewIssueUrl = ({ body, label, title }: Partial<IssueOptions> = {}) => {
  const baseUrl = `${repository.url}/issues/new`

  const searchParams = new URLSearchParams()

  const nextBody = [body || "", "", ...getCurrentEnvironment()].join("\n")
  searchParams.set("body", nextBody)
  if (label) searchParams.set("label", label)
  if (title) searchParams.set("title", title)

  return `${baseUrl}?${searchParams.toString()}`
}
