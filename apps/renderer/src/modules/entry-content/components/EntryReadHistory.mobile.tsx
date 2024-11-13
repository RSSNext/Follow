import { PresentSheet } from "@follow/components/ui/sheet/Sheet.js"

import { useWhoami } from "~/atoms/user"
import { useAuthQuery } from "~/hooks/common"
import { Queries } from "~/queries"
import { useEntryReadHistory } from "~/store/entry"

import { EntryUser, EntryUserRow } from "./EntryReadHistory.shared"

const LIMIT = 8
export const EntryReadHistory: Component<{ entryId: string }> = ({ entryId }) => {
  const me = useWhoami()
  const entryHistory = useEntryReadHistory(entryId)

  const { data } = useAuthQuery(Queries.entries.entryReadingHistory(entryId), {
    refetchInterval: 1000 * 60,
  })

  const totalCount = data?.total || 0

  if (!entryHistory) return null
  if (!me) return null
  if (!entryHistory.userIds) return null

  return (
    <div className="flex items-center pl-2 duration-200 animate-in fade-in" data-hide-in-print>
      {entryHistory.userIds
        .filter((id) => id !== me?.id)
        .slice(0, LIMIT)

        .map((userId, i) => (
          <EntryUser userId={userId} i={i} key={userId} />
        ))}

      {!!totalCount && totalCount > LIMIT && (
        <PresentSheet
          title="Entry Recent Readers"
          content={
            <ul className="flex flex-col gap-2 !text-base">
              {entryHistory.userIds
                .filter((id) => id !== me?.id)
                .slice(LIMIT)
                .map((userId) => (
                  <EntryUserRow userId={userId} key={userId} />
                ))}
            </ul>
          }
        >
          <button
            type="button"
            style={{
              marginLeft: `-${LIMIT * 8}px`,
              zIndex: LIMIT + 1,
            }}
            className="no-drag-region relative flex size-7 items-center justify-center rounded-full border border-border bg-muted ring-2 ring-background"
          >
            <span className="text-[10px] font-medium tabular-nums text-muted-foreground">
              +{Math.min(totalCount - LIMIT, 99)}
            </span>
          </button>
        </PresentSheet>
      )}
    </div>
  )
}
