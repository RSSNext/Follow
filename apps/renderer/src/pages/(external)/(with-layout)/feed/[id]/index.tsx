import { redirect } from "react-router-dom"

/**
 * @deprecated remove after split application
 */
export const loader = async ({ params }: { params: { id: string } }) => {
  return redirect(`/share/feeds/${params.id}`)
}
export function Component() {
  return null
}
