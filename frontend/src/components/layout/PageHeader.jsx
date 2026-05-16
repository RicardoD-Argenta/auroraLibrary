import styles from './PageHeader.module.css'

const PageHeader = ({ title, children }) => {
    return (
        <div className={styles.header}>
            <h2>{title}</h2>
            {children}
        </div>
    )
}

export default PageHeader
