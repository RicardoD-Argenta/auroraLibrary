import { FaChevronLeft, FaChevronRight  } from "react-icons/fa6";

// styles
import styles from './Pagination.module.css'

const Pagination = ({ page, totalPages, onPageChange }) => {

  function handlePageChange(e, fn) {
    e.preventDefault()
    onPageChange(fn)
  }

  return (
    <div className={styles.paginationContainer}>
      <button onClick={(e) => handlePageChange(e, p => p - 1)} disabled={page === 1}>
        <FaChevronLeft />
      </button>
      <span>{page} de {totalPages}</span>
      <button onClick={(e) => handlePageChange(e, p => p + 1)} disabled={page >= totalPages || totalPages === 0}>
        <FaChevronRight />
      </button>
    </div>
  )
}

export default Pagination
