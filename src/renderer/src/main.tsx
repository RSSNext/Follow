import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { LazyMotion, MotionConfig } from "framer-motion"

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        lazy: () => import('./pages/index')
      },
      {
        path: 'debug',
        lazy: () => import('./pages/debug')
      },
    ]
  }
])

const loadFeatures = () =>
  import("./framer-lazy-feature").then((res) => res.default)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <LazyMotion features={loadFeatures} strict key="framer">
      <MotionConfig
        transition={{
          type: "spring",
          duration: 0.3,
        }}
      >
        <RouterProvider router={router} />
      </MotionConfig>
    </LazyMotion>
  </React.StrictMode>
)
