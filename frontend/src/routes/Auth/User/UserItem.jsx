import { Link, useNavigate } from 'react-router-dom'
import styles from './UserItem.module.css'

// imports
import ListActions from '../../../components/lists/ListActions'

// hooks
import useAuth from '../../../hooks/useAuth'


const UserItem = ({ item, onDeleteSuccess }) => {
    const { deleteUser } = useAuth()
    const navigate = useNavigate()

    async function handleDelete(userId) {
        await deleteUser(userId)
        if (onDeleteSuccess) onDeleteSuccess()
    }

    async function handleEdit(userId) {
        navigate(`/user/edit?id=${userId}`)
    }

    if (item.role === 'admin') item.role = 'Administrador'
    else if (item.role === 'librarian') item.role = 'Bibliotecário'

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
                        <span className={styles.label}>Cargo:</span>
                        <span className={styles.role}>{item.role}</span>
                    </div>
                </div>
                <div className={styles.actionsContainer}>
                    <ListActions onDelete={() => handleDelete(item._id) } onEdit={() => handleEdit(item._id)} />
                </div>
            </div>
        </li>
    )
}

export default UserItem
