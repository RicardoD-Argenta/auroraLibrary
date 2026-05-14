import { Link, useNavigate } from 'react-router-dom'
import styles from './PublisherItem.module.css'

// imports
import ListActions from '../../../components/lists/ListActions'

// hooks
import usePublisher from '../../../hooks/usePublisher'


const PublisherItem = ({ item, onDeleteSuccess }) => {
    const { deletePublisher } = usePublisher()
    const navigate = useNavigate()

    async function handleDelete(publisherId) {
        await deletePublisher(publisherId)
        if (onDeleteSuccess) onDeleteSuccess()
    }

    async function handleEdit(publisherId) {
        navigate(`/book/publisher/edit?id=${publisherId}`)
    }

    return (
        <li>
            <div className={styles.itemContainer}>
                <div className={styles.nameContainer}>
                    <span className={styles.name}>{item.name}</span>
                </div>
                <ListActions onDelete={() => handleDelete(item._id) } onEdit={() => handleEdit(item._id)} />
            </div>
        </li>
    )
}

export default PublisherItem
