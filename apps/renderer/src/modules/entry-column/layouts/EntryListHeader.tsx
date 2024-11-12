import { withResponsiveComponent } from "@follow/components/utils/selector.js"

import type { EntryListHeaderProps } from "./EntryListHeader.shared"

export const EntryListHeader = withResponsiveComponent<EntryListHeaderProps>(
  () =>
    import("./EntryListHeader.desktop").then((mo) => ({
      default: mo.EntryListHeader,
    })),
  () =>
    import("./EntryListHeader.mobile").then((mo) => ({
      default: mo.EntryListHeader,
    })),
)
