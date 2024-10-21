import { redirect } from "react-router-dom"

export const loader = async ({ params }: { params: { id: string } }) => {
  return redirect(`/share/users/${params.id}`)
}
/**
 * @deprecated remove after split application
 */
export function Component() {
  return null
}
