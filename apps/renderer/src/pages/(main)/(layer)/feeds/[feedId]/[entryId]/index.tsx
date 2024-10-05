import { AnimatePresence } from "framer-motion"
import { useParams } from "react-router-dom"

import { useUISettingKey } from "~/atoms/settings/ui"
import { ActionButton } from "~/components/ui/button"
import { ROUTE_ENTRY_PENDING, views } from "~/constants"
import { useNavigateEntry } from "~/hooks/biz/useNavigateEntry"
import { useRouteView } from "~/hooks/biz/useRouteParams"
import { cn } from "~/lib/utils"
import { EntryContent } from "~/modules/entry-content"
import { AppLayoutGridContainerProvider } from "~/providers/app-grid-layout-container-provider"

export const Component = () => {
  const { entryId } = useParams()
  const view = useRouteView()
  const navigate = useNavigateEntry()

  const settingWideMode = useUISettingKey("wideMode")
  const realEntryId = entryId === ROUTE_ENTRY_PENDING ? "" : entryId
  const disable = views[view].wideMode || (settingWideMode && !realEntryId)
  const wideMode = settingWideMode && realEntryId

  return (
    <AnimatePresence>
      <AppLayoutGridContainerProvider>
        {!disable && (
          <div
            className={cn(
              "flex min-w-0 flex-1 flex-col",
              wideMode && "absolute inset-0 z-10 bg-white pl-12",
            )}
          >
            {wideMode && (
              <ActionButton
                className="absolute left-2.5 top-2.5 z-10"
                onClick={() => navigate({ entryId: null })}
              >
                <i className="i-mgc-close-cute-re text-2xl" />
              </ActionButton>
            )}
            <EntryContent entryId={realEntryId} />
          </div>
        )}
      </AppLayoutGridContainerProvider>
    </AnimatePresence>
  )
}
