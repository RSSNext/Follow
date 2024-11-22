import { ROUTE_ENTRY_PENDING } from "~/constants"
import { useRouteParamsSelector } from "~/hooks/biz/useRouteParams"
import { EntryContent } from "~/modules/entry-content"

import { EntryColumnMobile } from "../entry-column/mobile"

export const EntryContentMobile = () => {
  const { entryId } = useRouteParamsSelector((s) => ({
    entryId: s.entryId,
  }))

  if (entryId === ROUTE_ENTRY_PENDING) {
    return <EntryColumnMobile />
  }
  return <EntryContent entryId={entryId!} />
}
