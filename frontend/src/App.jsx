import './App.css'

import NavBar from './routes/Nav/NavBar.jsx'
import Container from './routes/Container.jsx'

import { Outlet } from 'react-router-dom'

function App() {


  return (
    <div className="app">
      <NavBar />
      <Container>
        <Outlet />
      </Container>
    </div>
  )
}

export default App
