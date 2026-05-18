import { Link, useNavigate } from 'react-router-dom'
import styles from './GenreItem.module.css'

// imports
import ListActions from '../../../components/lists/ListActions'

// hooks
import useGenre from '../../../hooks/useGenre'

const GenreItem = ({ item, onClick, onDeleteSuccess }) => {

    const { deleteGenre } = useGenre()
    const navigate = useNavigate()

    async function handleDelete(genreId) {
        await deleteGenre(genreId)
        if (onDeleteSuccess) onDeleteSuccess()
    }

    async function handleEdit(genreId) {
        navigate(`/book/genre/edit?id=${genreId}`)
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
                            <span className={styles.label}>Gênero Pai:</span>
                            <span className={styles.name}>{item.parentId ? item.parentId.name : 'Não definido'}</span>
                        </div>
                    </div>
                </div>
            </li>
        )
    }

    return (
        <li className={styles.list}>
            <div className={styles.itemContainer}>
                <div className={styles.contentContainer}>
                    <span className={styles.code}>ID: {item.code}</span>
                    <div className={styles.labelContainer}>
                        <span className={styles.label}>Nome:</span>
                        <span className={styles.name}>{item.name}</span>
                    </div>
                    <div className={styles.labelContainer}>
                            <span className={styles.label}>Gênero Pai:</span>
                            <span className={styles.name}>{item.parentId ? item.parentId.name : 'Não definido'}</span>
                    </div>
                </div>
                <div className={styles.actionsContainer}>
                    <ListActions onDelete={() => handleDelete(item._id) } onEdit={() => handleEdit(item._id)} />
                </div>
            </div>
        </li>
    )
}

export default GenreItem
