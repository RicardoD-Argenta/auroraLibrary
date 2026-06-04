import styles from './TopBooksChart.module.css'

const TopBooksChart = ({ data = [] }) => {
    const max = Math.max(...data.map(d => d.total), 1)

    return (
        <div className={styles['top-books']}>
            {data.map((book, i) => (
                <div key={i} className={styles['row']}>
                    <span className={styles['title']} title={book.title}>{book.title}</span>
                    <div className={styles['bar-track']}>
                        <div
                            className={styles['bar-fill']}
                            style={{ width: `${(book.total / max) * 100}%` }}
                        />
                    </div>
                    <span className={styles['count']}>{book.total}</span>
                </div>
            ))}
        </div>
    )
}

export default TopBooksChart