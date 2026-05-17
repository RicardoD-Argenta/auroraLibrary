import { Link, useNavigate } from 'react-router-dom'
import styles from './AuthorItem.module.css'

// imports
import ListActions from '../../../components/lists/ListActions'

// hooks
import useAuthor from '../../../hooks/useAuthor'


const AuthorItem = ({ item, onDeleteSuccess }) => {
    const { deleteAuthor } = useAuthor()
    const navigate = useNavigate()

    async function handleDelete(authorId) {
        await deleteAuthor(authorId)
        if (onDeleteSuccess) onDeleteSuccess()
    }

    async function handleEdit(authorId) {
        navigate(`/book/author/edit?id=${authorId}`)
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
                </div>
                <ListActions onDelete={() => handleDelete(item._id) } onEdit={() => handleEdit(item._id)} />
            </div>
        </li>
    )
}

export default AuthorItem
