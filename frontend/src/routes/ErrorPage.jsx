import { useNavigate } from 'react-router-dom'
import { FaChevronLeft } from "react-icons/fa";

// Components
import Button from '../components/form/Button'

import styles from './ErrorPage.module.css'

const ErrorPage = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.contentContainer}>
      <div className={styles.content}>
        <h1>Ops, ocorreu um erro!</h1>
        <p>Algo deu errado. <br /> Por favor, tente novamente mais tarde.</p>
        <div className={styles.buttonContainer}>
          <Button variant="submit" onClick={() => navigate('/')}><FaChevronLeft /> Voltar</Button>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage