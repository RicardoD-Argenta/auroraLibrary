import { useNavigate } from 'react-router-dom'
import styles from './AlertItem.module.css'

const AlertItem = ({ item }) => {
  const navigate = useNavigate()

  function handleClick() {
    if (item.loanDelayId) {
      navigate(`/loan/delay/edit?id=${item.loanDelayId}`)
    }
  }

  return (
    <div
      className={styles["alert-item"]}
      onClick={handleClick}
      style={{ cursor: item.loanDelayId ? 'pointer' : 'default' }}
    >
      <div className={styles["days-late-container"]}>
        <span>{item.daysLate} {item.daysLate === 1 ? 'dia' : 'dias'}</span>
      </div>
      <div className={styles["name-container"]}>
        <span>{item.memberName}</span>
      </div>
      <div className={styles["hyphen-container"]}>
        <span>-</span>
      </div>
      <div className={styles["book-container"]}>
        <span>{item.bookTitle}</span>
      </div>
    </div>
  )
}

export default AlertItem