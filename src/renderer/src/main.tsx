import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { LazyMotion, MotionConfig } from "framer-motion"
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

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

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <LazyMotion features={loadFeatures} strict key="framer">
      <MotionConfig
        transition={{
          type: "spring",
          duration: 0.3,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </MotionConfig>
    </LazyMotion>
  </React.StrictMode>
)
