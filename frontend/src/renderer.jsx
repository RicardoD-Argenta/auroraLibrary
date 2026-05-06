import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.jsx'
import ErrorPage from './routes/ErrorPage.jsx'
import Home from './routes/Home.jsx'

// Auth
import Login from './routes/Auth/Login.jsx'
import Register from './routes/Auth/Register.jsx'


// Context
import { UserProvider } from './context/UserContext.jsx'

import { createBrowserRouter, RouterProvider, Route, Navigate } from 'react-router-dom'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage/>, // pagina de erro para quando a rota não for encontrada ou ocorrer algum erro no carregamento da página
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      },
    ]
  },
])

createRoot(document.getElementById('root')).render(
  <UserProvider>
    <RouterProvider router={router} />
  </UserProvider>
)
