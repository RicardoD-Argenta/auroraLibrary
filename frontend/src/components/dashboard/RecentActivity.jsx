import styles from './RecentActivity.module.css'

function formatDate(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now.setHours(0,0,0,0) - date.setHours(0,0,0,0)) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'hoje'
  if (diffDays === 1) return 'ontem'
  if (diffDays === 2) return 'anteontem'
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

const RecentActivity = ({ item }) => {
  return (
    <div className={styles['activity-container']}>
      <div className={styles['content-container']}>
        <div className={styles['member']}>
            <span>{item.memberName}</span>
        </div>
        <div className={styles['book-container']}>
            <div className={styles['book']}>
                <span>{item.bookTitle}</span>
            </div>
            <div className="hyphen">
                <span>-</span>
            </div>
            <div className={styles['type']}>
                <span>{item.type}</span>
            </div>
        </div>
      </div>
      <time className={styles['date']} title={item.date}>{formatDate(item.date)}</time>
    </div>
  )
}

export default RecentActivity