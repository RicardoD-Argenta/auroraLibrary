import { Link, useNavigate } from 'react-router-dom'
import styles from './SectorItem.module.css'

// imports
import ListActions from '../../../components/lists/ListActions'

// hooks
import useSector from '../../../hooks/useSector'


const SectorItem = ({ item, onDeleteSuccess }) => {
    const { deleteSector } = useSector()
    const navigate = useNavigate()

    async function handleDelete(sectorId) {
        await deleteSector(sectorId)
        if (onDeleteSuccess) onDeleteSuccess()
    }

    async function handleEdit(sectorId) {
        navigate(`/library/sector/edit?id=${sectorId}`)
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

export default SectorItem
