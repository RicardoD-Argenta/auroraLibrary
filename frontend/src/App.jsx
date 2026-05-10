import './App.css'

import NavBar from './routes/Nav/NavBar.jsx'
import SideBar from './routes/Nav/SideBar.jsx'

import { Outlet, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Context
import { UserProvider } from './context/UserContext.jsx'
import { SideBarProvider, useSideBar } from './context/SideBarContext.jsx'

const PUBLIC_ROUTES = ['/login']

function AppLayout() {
  const { collapsed } = useSideBar()
  const { pathname } = useLocation()
  const isPublic = PUBLIC_ROUTES.includes(pathname)

  return (
    <div className="app">
      <NavBar />
      <div className="app-container">
        {!isPublic && <SideBar />}
        <div className={`content ${collapsed || isPublic ? 'content-expanded' : ''} ${!isPublic ? 'content-private' : ''}`}>
          <Outlet />
        </div>
      </div>
      <ToastContainer limit={3} newestOnTop />
    </div>
  )
}

function App() {
  return (
    <UserProvider>
      <SideBarProvider>
        <AppLayout />
      </SideBarProvider>
    </UserProvider>
  )
}

export default App
