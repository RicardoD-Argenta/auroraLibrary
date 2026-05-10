import React from 'react'

import { Link } from 'react-router-dom'

const ErrorPage = () => {
  return (
    <div>
      <h1>Ops, ocorreu um erro!</h1>
      <p>Algo deu errado. Por favor, tente novamente mais tarde.</p>
      <Link to="/">Voltar para a página inicial</Link>
    </div>
  )
}

export default ErrorPage