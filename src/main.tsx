import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './styles/tailwind.css'
import App from './App'
import Home from './pages/Home'
import Reader from './pages/Reader'
import Articles from './pages/Articles'
import Account from './pages/Account'
import ShareTarget from './pages/ShareTarget'

const router = createBrowserRouter([
  { path: '/', element: <App />, children: [
    { index: true, element: <Home /> },
    { path: 'reader/:id', element: <Reader /> },
    { path: 'articles', element: <Articles /> },
    { path: 'account', element: <Account /> },
    { path: 'share-target', element: <ShareTarget /> }
  ]}
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

import { setupMockServer } from './mock-server'
if (import.meta.env.DEV) setupMockServer()
