import { ROUTE_ENTRY_PENDING, views } from "@renderer/constants"
import { useRouteView } from "@renderer/hooks/biz/useRouteParams"
import { EntryContent } from "@renderer/modules/entry-content"
import { AnimatePresence } from "framer-motion"
import { useParams } from "react-router-dom"

export const Component = () => {
  const { entryId } = useParams()
  const view = useRouteView()
  const inWideMode = view ? views[view].wideMode : false
  return (
    <AnimatePresence>
      {!inWideMode && (
        <div className="min-w-0 flex-1">
          <EntryContent entryId={entryId === ROUTE_ENTRY_PENDING ? "" : entryId} />
        </div>
      )}
    </AnimatePresence>
  )
}
