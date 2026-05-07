import './App.css'

import NavBar from './routes/Nav/NavBar.jsx'
import Container from './routes/Container.jsx'

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
        <Container>
          <Outlet />
        </Container>
        <ToastContainer limit={3} newestOnTop />
      </div>
    </UserProvider>
  )
}

export default App
