import { withResponsiveComponent } from "@follow/components/utils/selector.js"

import type { EntryHeaderProps } from "./header.shared"

const EntryHeaderDesktop = () =>
  import("./header.desktop").then((m) => ({ default: m.EntryHeader }))
const EntryHeaderMobile = () => import("./header.mobile").then((m) => ({ default: m.EntryHeader }))
export const EntryHeader = withResponsiveComponent<EntryHeaderProps>(
  EntryHeaderDesktop,
  EntryHeaderMobile,
)
