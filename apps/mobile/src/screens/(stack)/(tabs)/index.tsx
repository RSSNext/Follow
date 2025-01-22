import { EntryList } from "@/src/modules/entry-list/entry-list"
import { ViewSelector } from "@/src/modules/feed-drawer/view-selector"

export default function Index() {
  return (
    <>
      <ViewSelector />
      <EntryList />
    </>
  )
}
