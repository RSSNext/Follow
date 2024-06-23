import { redirect } from "react-router-dom"

export const Component = () => null

export const loader = () => {
  redirect("/settings/general")
  return null
}
