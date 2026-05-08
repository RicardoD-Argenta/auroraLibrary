import { Link } from 'react-router-dom'
import { useContext } from 'react'

import styles from './SideBar.module.css'

// context
import { UserContext } from '../../context/UserContext.jsx'

const SideBar = () => {
  const { auth } = useContext(UserContext)
  const { authenticated } = auth

  if (!authenticated) return null

  return (
    <div>
        <ul className={styles.sideBarContainer}>
            <li><Link to="/">Home</Link></li>
        </ul>
    </div>
  )
}

export default SideBar