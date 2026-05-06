import { useState, useContext } from 'react'

// Context
import { UserContext } from '../../context/UserContext.jsx'

const Login = () => {
  return (
    <section>
      <h2>Login</h2>
      <form>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <input type="submit" value="Login" />
      </form>
    </section>
  )
}

export default Login