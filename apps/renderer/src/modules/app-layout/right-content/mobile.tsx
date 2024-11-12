import { useRouteParamsSelector } from "~/hooks/biz/useRouteParams"
import { EntryContent } from "~/modules/entry-content"

export const RightContentMobile = () => {
  const { entryId } = useRouteParamsSelector((s) => ({
    entryId: s.entryId,
  }))
  return <EntryContent entryId={entryId!} />
}
