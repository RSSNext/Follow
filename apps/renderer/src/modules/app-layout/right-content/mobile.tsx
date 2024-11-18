import { ROUTE_ENTRY_PENDING } from "~/constants"
import { useRouteParamsSelector } from "~/hooks/biz/useRouteParams"
import { EntryContent } from "~/modules/entry-content"

import { CenterColumnMobile } from "../center-column/mobile"

export const RightContentMobile = () => {
  const { entryId } = useRouteParamsSelector((s) => ({
    entryId: s.entryId,
  }))

  if (entryId === ROUTE_ENTRY_PENDING) {
    return <CenterColumnMobile />
  }
  return <EntryContent entryId={entryId!} />
}
