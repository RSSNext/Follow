import { ListItem } from "@renderer/modules/entry-column/list-item-template"

import type { UniversalItemProps } from "./types"

export function ArticleItem({ entryId, entryPreview, translation }: UniversalItemProps) {
  return (
    <ListItem entryId={entryId} entryPreview={entryPreview} translation={translation} withDetails />
  )
}
