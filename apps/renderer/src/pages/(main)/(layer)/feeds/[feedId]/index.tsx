import { redirect } from "react-router-dom"

import { ROUTE_ENTRY_PENDING } from "~/constants"

export const loader = ({ request }: { request: Request; params: { feedId: string } }) => {
  const url = new URL(request.url)
  return redirect(`${url.pathname}/${ROUTE_ENTRY_PENDING}`)
}
