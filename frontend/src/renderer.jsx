import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.jsx'
import ErrorPage from './routes/ErrorPage.jsx'
import Home from './routes/Home.jsx'

// Auth
import Login from './routes/Auth/Login.jsx'
import Register from './routes/Auth/Register.jsx'

import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from './context/UserContext.jsx'

const PrivateRoute = ({ roles }) => {
  const { auth } = useContext(UserContext)
  const { authenticated, user, authLoading } = auth

  if (authLoading) return null
  if (!authenticated) return <Navigate to="/login" />
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/" />
  return <Outlet />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage/>,
    children: [
      {
        element: <PrivateRoute />,
        children: [
          {
            path: '/',
            element: <Home />
          },
          {
            path: '/register',
            element: <Register />
          },
        ]
      },
      {
        path: '/login',
        element: <Login />
      },
    ]
  },
])

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
