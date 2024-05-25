import "./assets/main.css"

import * as React from "react"
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
            lazy: () => import("./pages/(main)/(context)/layout"),
            children: [
              {
                path: "",
                lazy: () => import("./pages/(main)/(context)/index"),
              },
              {
                path: "/follow",
                lazy: () => import("./pages/(main)/(context)/follow/layout"),
                children: [
                  {
                    path: "",
                    lazy: () => import("./pages/(main)/(context)/follow/index"),
                  },
                ],
              },
              {
                path: "/profile",
                lazy: () => import("./pages/(main)/(context)/profile/layout"),
                children: [
                  {
                    path: "",
                    lazy: () =>
                      import("./pages/(main)/(context)/profile/index"),
                  },
                ],
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
        lazy: () => import("./pages/settings/layout"),
        children: [
          {
            path: "",
            lazy: () => import("./pages/settings/index"),
          },
          {
            path: "rsshub",
            lazy: () => import("./pages/settings/rsshub"),
          },
          {
            path: "profile",
            lazy: () => import("./pages/settings/profile"),
          },
        ],
      },
      {
        path: "debug",
        lazy: () => import("./pages/debug"),
      },
      {
        path: "/feed/:id",
        lazy: () => import("./pages/feed/layout"),
        children: [
          {
            path: "",
            lazy: () => import("./pages/feed/index"),
          },
        ],
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

ReactDOM.createRoot(document.querySelector("#root") as HTMLElement).render(
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
