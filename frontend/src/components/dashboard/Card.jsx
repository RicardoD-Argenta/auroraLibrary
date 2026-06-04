import styles from './Card.module.css'

const Card = ({ icon, title, data, subtitle }) => {
  return (
    <div className={styles["card"]}>
        <div className={styles["card-content"]}>
            <div className={styles["card-header"]}>
                <span>{icon} {title}</span>
            </div>
            <div className={styles["card-body"]}>
                <span>{data}</span>
            </div>
            <div className={styles["card-footer"]}>
                <span>{subtitle}</span>
            </div>
        </div>
    </div>
  )
}

export default Card