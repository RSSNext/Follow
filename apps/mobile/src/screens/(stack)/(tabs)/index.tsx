import { useEffect } from "react"

import { prepareEntryRenderWebView } from "@/src/components/native/webview"
import { EntryList } from "@/src/modules/entry-list"

export default function Index() {
  useEffect(() => {
    prepareEntryRenderWebView()
  }, [])

  return <EntryList />
}
