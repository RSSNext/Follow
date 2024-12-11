import { withResponsiveSyncComponent } from "@follow/components/utils/selector.js"

import { ModalStack as Desktop } from "./modal-stack.desktop"
import { ModalStack as Mobile } from "./modal-stack.mobile"

export const ModalStack = withResponsiveSyncComponent(Desktop, Mobile)
