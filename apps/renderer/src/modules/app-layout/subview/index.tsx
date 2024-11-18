import { withResponsiveSyncComponent } from "@follow/components/utils/selector.js"

import { SubviewLayout as SubviewLayoutDesktop } from "./index.desktop"
import { SubviewLayout as SubviewLayoutMobile } from "./index.mobile"

export const SubviewLayout = withResponsiveSyncComponent(SubviewLayoutDesktop, SubviewLayoutMobile)
