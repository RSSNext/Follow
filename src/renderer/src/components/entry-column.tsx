import { ActivedList } from '@renderer/lib/types'

export function EntryColumn({
  activedList,
}: {
  activedList: ActivedList,
}) {
  return (
    <div>
      {JSON.stringify(activedList)}
    </div>
  )
}
