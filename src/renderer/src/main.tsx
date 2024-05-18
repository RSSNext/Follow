import "./assets/main.css"

import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { LazyMotion, MotionConfig } from "framer-motion"
import { QueryClientProvider } from "@tanstack/react-query"
import { authConfigManager, SessionProvider } from "@hono/auth-js/react"
import { Toaster } from "@renderer/components/ui/toaster"
import { queryClient } from "@renderer/lib/query-client"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        lazy: () => import("./pages/(main)/layout"),
        children: [
          {
            path: "",
            lazy: () => import("./pages/(main)/index"),
          },
          {
            path: "/follow",
            lazy: () => import("./pages/(main)/follow/layout"),
            children: [
              {
                path: "",
                lazy: () => import("./pages/(main)/follow/index"),
              },
            ],
          },
          {
            path: "/profile",
            lazy: () => import("./pages/(main)/profile/layout"),
            children: [
              {
                path: "",
                lazy: () => import("./pages/(main)/profile/index"),
              },
            ],
          },
        ],
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
        path: "settings",
        lazy: () => import("./pages/settings"),
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

authConfigManager.setConfig({
  baseUrl: import.meta.env.VITE_API_URL,
  basePath: "/auth",
  credentials: "include",
})

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <LazyMotion features={loadFeatures} strict key="framer">
      <MotionConfig
        transition={{
          type: "tween",
          duration: 0.15,
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
    <Toaster />
  </React.StrictMode>,
)
