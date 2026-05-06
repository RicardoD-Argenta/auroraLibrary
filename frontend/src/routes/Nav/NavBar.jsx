import { Link } from 'react-router-dom'

import styles from './NavBar.module.css'

const NavBar = () => {
  return (
    <nav className={styles.navbar}>
        <ul className={styles.navlist}>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/">Home</Link></li>
        </ul>
    </nav>
  )
}

export default NavBar