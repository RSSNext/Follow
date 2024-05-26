import "./assets/main.css"

import { authConfigManager } from "@hono/auth-js/react"
import * as React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import App from "./App"
import { RootProviders } from "./providers/root-providers"

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

authConfigManager.setConfig({
  baseUrl: import.meta.env.VITE_API_URL,
  basePath: "/auth",
  credentials: "include",
})

ReactDOM.createRoot(document.querySelector("#root") as HTMLElement).render(
  <React.StrictMode>
    <RootProviders>
      <RouterProvider router={router} />
    </RootProviders>
  </React.StrictMode>,
)
