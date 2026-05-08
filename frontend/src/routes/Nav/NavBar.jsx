import { Link } from 'react-router-dom'
import { useContext } from 'react'

import styles from './NavBar.module.css'

// context
import { UserContext } from '../../context/UserContext.jsx'

const NavBar = () => {

  const { auth } = useContext(UserContext)
  const { authenticated, logout } = auth

  if (!authenticated) return null

  return (
    <nav className={styles.navbar}>
        <ul className={styles.navlist}>
            <li onClick={logout}><a href="#">Logout</a></li>
        </ul>
    </nav>
  )
}

export default NavBar