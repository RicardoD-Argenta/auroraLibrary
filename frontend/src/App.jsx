import './App.css'

import NavBar from './routes/Nav/NavBar.jsx'
import SideBar from './routes/Nav/SideBar.jsx'

import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Context
import { UserProvider } from './context/UserContext.jsx'

function App() {


  return (
    <UserProvider>
      <div className="app">
        <NavBar />
        <div className="app-container">
          <div className="side-bar">
            <SideBar />
          </div>
          <div className="content">
            <Outlet />
          </div>
        </div>
        <ToastContainer limit={3} newestOnTop />
      </div>
    </UserProvider>
  )
}

export default App
