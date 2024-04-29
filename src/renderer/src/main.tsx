import "./assets/main.css"

import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { LazyMotion, MotionConfig } from "framer-motion"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { authConfigManager, SessionProvider } from "@hono/auth-js/react"
import { persistQueryClient } from "@tanstack/react-query-persist-client"
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        lazy: () => import("./pages/index"),
      },
      {
        path: "login",
        lazy: () => import("./pages/login"),
      },
      {
        path: "redirect",
        lazy: () => import("./pages/redirect"),
      },
      {
        path: "debug",
        lazy: () => import("./pages/debug"),
      },
    ],
  },
])

const loadFeatures = () =>
  import("./framer-lazy-feature").then((res) => res.default)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: Infinity,
    },
  },
})

const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
})

persistQueryClient({
  queryClient,
  persister: localStoragePersister,
})

authConfigManager.setConfig({
  baseUrl: import.meta.env.VITE_ELECTRON_REMOTE_API_URL,
  basePath: "/auth",
  credentials: "include",
})

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <LazyMotion features={loadFeatures} strict key="framer">
      <MotionConfig
        transition={{
          type: "tween",
          duration: 0.1,
          ease: "easeInOut",
        }}
      >
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </SessionProvider>
      </MotionConfig>
    </LazyMotion>
  </React.StrictMode>,
)
