import * as React from "react"

import type { IPortalMethods } from "./type"

export default React.createContext<IPortalMethods | null>(null)
