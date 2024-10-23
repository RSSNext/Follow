import { Outlet } from "react-router-dom"

import { RootProviders } from "./providers/root-providers"

function App() {
  return (
    <RootProviders>
      <Outlet />
    </RootProviders>
  )
}

export { App as Component }
