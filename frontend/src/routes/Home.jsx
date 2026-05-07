import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import useToast from '../hooks/useToast'

const Home = () => {
  const location = useLocation()
  const toast = useToast()

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message)
    }
  }, [])

  return (
    <div>
        <h2>Home</h2>
    </div>
  )
}

export default Home