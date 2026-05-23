import { Link, useNavigate } from 'react-router-dom'
import styles from './ShelfItem.module.css'

// imports
import ListActions from '../../../components/lists/ListActions'

// hooks
import useShelf from '../../../hooks/useShelf'


const ShelfItem = ({ item, onClick, onDeleteSuccess }) => {
    const { deleteShelf } = useShelf()
    const navigate = useNavigate()

    async function handleDelete(shelfId) {
        await deleteShelf(shelfId)
        if (onDeleteSuccess) onDeleteSuccess()
    }

    async function handleEdit(shelfId) {
        navigate(`/library/shelf/edit?id=${shelfId}`)
    }

    if (onClick) {
        return (
            <li className={styles.clickable} onClick={onClick}>
                <div className={styles.itemContainer}>
                    <div className={styles.contentContainer}>
                        <span className={styles.code}>ID: {item.code}</span>
                        <div className={styles.labelContainer}>
                            <span className={styles.label}>Nome:</span>
                            <span className={styles.name}>{item.name}</span>
                        </div>
                        <div className={styles.labelContainer}>
                            <span className={styles.label}>Descrição:</span>
                            <span className={styles.name}>{item.description ? item.description : 'Não definido'}</span>
                        </div>
                    </div>
                </div>
            </li>
        )
    }

    return (
        <li>
            <div className={styles.itemContainer}>
                <div className={styles.contentContainer}>
                    <span className={styles.code}>ID: {item.code}</span>
                    <div className={styles.labelContainer}>
                        <span className={styles.label}>Nome:</span>
                        <span className={styles.name}>{item.name}</span>
                    </div>
                    <div className={styles.labelContainer}>
                        <span className={styles.label}>Descrição:</span>
                        <span className={styles.name}>{item.description ? item.description : 'Não definido'}</span>
                    </div>
                </div>
                <div className={styles.actionsContainer}>
                    <ListActions onDelete={() => handleDelete(item._id) } onEdit={() => handleEdit(item._id)} />
                </div>
            </div>
        </li>
    )
}

export default ShelfItem
