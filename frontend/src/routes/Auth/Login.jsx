import { useState, useContext } from 'react'
import { FaUserAlt, FaKey } from 'react-icons/fa'
import useToast from '../../hooks/useToast'

// Components
import Input from '../../components/form/Input.jsx'

// Context
import { UserContext } from '../../context/UserContext.jsx'

import styles from './Login.module.css'

const Login = () => {

  const [user, setUser] = useState({
    login: '',
    password: ''
  })

  const { auth } = useContext(UserContext)
  const { login, loading } = auth

  const toast = useToast()

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const result = await login(user)
  }

  return (
    <div className={styles['login-page']}>
    <section className={styles['form-container']}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles['form-control']}>
          <label htmlFor="login">Usuário</label>
          <div className={styles['input-wrapper']}>
            <span><FaUserAlt /></span>
            <input type="text" name="login" placeholder="" value={user.login} onChange={handleChange} />
          </div>
          <label htmlFor="password">Senha</label>
          <div className={styles['input-wrapper']}>
            <span><FaKey /></span>
            <input type="password" name="password" placeholder="" value={user.password} onChange={handleChange} />
          </div>
        </div>
        {!loading ?  <Input type="submit" value="Login"/> : <Input type="submit" value="Login" disabled='disabled' /> }
      </form>
    </section>
    </div>
  )
}

export default Login