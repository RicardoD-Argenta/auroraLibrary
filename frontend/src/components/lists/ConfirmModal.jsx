import styles from './ConfirmModal.module.css'
import { MdDeleteForever } from 'react-icons/md'

const ConfirmModal = ({ message = 'Tem certeza que deseja excluir?', onConfirm, onCancel }) => {
    return (
        <div className={styles.overlay} onClick={onCancel}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <p>{message}</p>
                <div className={styles.modalActions}>
                    <button className={styles.cancelBtn} onClick={onCancel}>Voltar</button>
                    <button className={styles.deleteBtn} onClick={onConfirm}><MdDeleteForever /> Excluir</button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal
