import { repository } from "@pkg"

interface IssueOptions {
  title: string
  body: string
  label: string
}
export const getNewIssueUrl = ({
  body,
  label,
  title,
}: Partial<IssueOptions> = {}) => {
  const baseUrl = `${repository.url}/issues/new`

  const searchParams = new URLSearchParams()
  if (body) searchParams.set("body", (body))
  if (label) searchParams.set("label", label)
  if (title) searchParams.set("title", (title))

  return `${baseUrl}?${searchParams.toString()}`
}
