import { createBrowserRouter } from "react-router-dom"

import App from "./App"

export const router = createBrowserRouter([
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
                path: "/discover",
                lazy: () => import("./pages/(main)/(context)/discover/layout"),
                children: [
                  {
                    path: "",
                    lazy: () =>
                      import("./pages/(main)/(context)/discover/index"),
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
        path: "",
        lazy: () => import("./pages/(external)/layout"),
        children: [
          {
            path: "login",
            lazy: () => import("./pages/(external)/login"),
          },
          {
            path: "redirect",
            lazy: () => import("./pages/(external)/redirect"),
          },
          {
            path: "debug",
            lazy: () => import("./pages/(external)/debug"),
          },
          {
            path: "/feed/:id",
            lazy: () => import("./pages/(external)/feed/layout"),
            children: [
              {
                path: "",
                lazy: () => import("./pages/(external)/feed/index"),
              },
            ],
          },
        ],
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
        path: "add",
        children: [
          {
            path: "",
            lazy: () => import("./pages/add/index"),
          },
        ],
      },
      {
        path: "preview",
        children: [
          {
            path: "",
            lazy: () => import("./pages/preview"),
          },
        ],
      },
    ],
  },
])
