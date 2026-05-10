import { createContext, useState, useContext } from 'react'

const SideBarContext = createContext()

export const SideBarProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)

  const toggle = () => setCollapsed(prev => !prev)

  return (
    <SideBarContext.Provider value={{ collapsed, toggle }}>
      {children}
    </SideBarContext.Provider>
  )
}

export const useSideBar = () => useContext(SideBarContext)
