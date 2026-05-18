import { Link } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import { FaChevronRight, FaChevronDown } from "react-icons/fa6";
import { UserContext } from '../../context/UserContext.jsx'

import styles from './SideBar.module.css'

const SideBarItem = ({ item, sidebarCollapsed = false }) => {
  const { auth } = useContext(UserContext)
  const { user } = auth
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (sidebarCollapsed) setOpen(false)
  }, [sidebarCollapsed])

  if (item.roles && (!user || !item.roles.includes(user.role))) return null

  if (item.children) {
    const Icon = item.icon
    return (
      <li>
        <button className={styles.dropdownToggle} onClick={() => setOpen(!open)}>
          {Icon && <Icon />}
          {item.label}
          <span>{open ? <FaChevronDown /> : <FaChevronRight />}</span>
        </button>
        <ul className={`${styles.dropdownMenu} ${open ? styles.open : ''}`}>
            {item.children.map(child => (
              <SideBarItem key={child.label} item={child} sidebarCollapsed={sidebarCollapsed} />
            ))}
        </ul>
      </li>
    )
  }

  const Icon = item.icon
  return (
    <li>
      <Link to={item.path}>{Icon && <Icon />}{item.label}</Link>
    </li>
  )
}

export default SideBarItem
