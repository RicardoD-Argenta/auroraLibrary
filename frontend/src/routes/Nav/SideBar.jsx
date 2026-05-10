import { useContext } from 'react'

import styles from './SideBar.module.css'

// context
import { UserContext } from '../../context/UserContext.jsx'
import { useSideBar } from '../../context/SideBarContext.jsx'

// svg
import { IoMenu } from "react-icons/io5";

// data
import { sidebarData } from './SideBarData.jsx'
import SideBarItem from './SideBarItem.jsx'

const SideBar = () => {
  const { auth } = useContext(UserContext)
  const { authenticated } = auth
  const { collapsed, toggle } = useSideBar()

  if (!authenticated) return null

  return (
    <div className={`${styles.sideBarContainer} ${collapsed ? styles.colapse : ''}`}>
        <div className={styles.sideBar}>
          <div className={styles.sideBarHeader}>
            <button onClick={toggle}><IoMenu /></button>
          </div>
          <div className={`${styles.sideBarContent} ${collapsed ? styles.colapse : ''}`}>
            {sidebarData.map(item => (
              <SideBarItem key={item.label} item={item} sidebarCollapsed={collapsed} />
            ))}
          </div>
        </div>
    </div>
  )
}

export default SideBar