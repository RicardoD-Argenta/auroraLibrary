import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.jsx'
import ErrorPage from './routes/ErrorPage.jsx'
import Home from './routes/Home.jsx'

// Auth
import Login from './routes/Auth/Login.jsx'

// Book

  // Publisher
  import CreatePublisher from './routes/Book/Publisher/CreatePublisher.jsx'
  import ListPublisher from './routes/Book/Publisher/ListPublisher.jsx'
  import EditPublisher from './routes/Book/Publisher/EditPublisher.jsx'

  // Author
  import CreateAuthor from './routes/Book/Author/CreateAuthor.jsx'
  import ListAuthor from './routes/Book/Author/ListAuthor.jsx'
  import EditAuthor from './routes/Book/Author/EditAuthor.jsx'

  // Genre
  import CreateGenre from './routes/Book/Genre/CreateGenre.jsx'
  import ListGenre from './routes/Book/Genre/ListGenre.jsx'
  import GenreEdit from './routes/Book/Genre/EditGenre.jsx'

// Library

  // Sector
  import CreateSector from './routes/Library/Sector/CreateSector.jsx'
  import ListSector from './routes/Library/Sector/ListSector.jsx'
  import EditSector from './routes/Library/Sector/EditSector.jsx'

  // Shelf
  import CreateShelf from './routes/Library/Shelf/CreateShelf.jsx'
  import ListShelf from './routes/Library/Shelf/ListShelf.jsx'
  import EditShelf from './routes/Library/Shelf/EditShelf.jsx'

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
          // Publishers
          {
            path: '/book/publisher/register',
            element: <CreatePublisher />
          },
          {
            path: '/book/publisher/list',
            element: <ListPublisher />
          },
          {
            path: '/book/publisher/edit',
            element: <EditPublisher />
          },
          // Authors
          {
            path: '/book/author/register',
            element: <CreateAuthor />
          },
          {
            path: '/book/author/list',
            element: <ListAuthor />
          },
          {
            path: '/book/author/edit',
            element: <EditAuthor />
          },
          // Genre
          {
            path: '/book/genre/register',
            element: <CreateGenre />
          },
          {
            path: '/book/genre/list',
            element: <ListGenre />
          },
          {
            path: '/book/genre/edit',
            element: <GenreEdit />
          },
          // Sector
          {
            path: '/library/sector/register',
            element: <CreateSector />
          },
          {
            path: '/library/sector/list',
            element: <ListSector />
          },
          {
            path: '/library/sector/edit',
            element: <EditSector />
          },
          // Shelf
          {
            path: '/library/shelf/register',
            element: <CreateShelf />
          },
          {
            path: '/library/shelf/list',
            element: <ListShelf />
          },
          {
            path: '/library/shelf/edit',
            element: <EditShelf />
          }
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
