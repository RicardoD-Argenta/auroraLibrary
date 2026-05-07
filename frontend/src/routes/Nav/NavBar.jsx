import { Link } from 'react-router-dom'
import { useContext } from 'react'

import styles from './NavBar.module.css'

// context
import { UserContext } from '../../context/UserContext.jsx'

const NavBar = () => {

  const { auth } = useContext(UserContext)
  const { authenticated, logout } = auth

  return (
    <nav className={styles.navbar}>
        <ul className={styles.navlist}>
            { authenticated ? (
              <>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/">Home</Link></li>
                <li onClick={logout}><a href="#">Logout</a></li>
              </>
            ):
            (
              <>
                <li><Link to="/login">Login</Link></li>
              </>
            )}
            
        </ul>
    </nav>
  )
}

export default NavBar