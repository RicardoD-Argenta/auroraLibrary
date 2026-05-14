import { useState } from 'react'
import styles from './ListActions.module.css'

import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import ConfirmModal from './ConfirmModal'

const ListActions = ({ onDelete, onEdit }) => {
    const [showConfirm, setShowConfirm] = useState(false)

    function handleEdit(e) {
        e.preventDefault()
        if (onEdit) onEdit()
    }

    function handleDeleteClick(e) {
        e.preventDefault()
        setShowConfirm(true)
    }

    async function handleConfirm() {
        if (onDelete) await onDelete()
        setShowConfirm(false)
    }

    function handleCancel() {
        setShowConfirm(false)
    }

  return (
    <>
        <div className={styles.actionsContainer}>
            <button onClick={handleEdit}><span>Editar</span><FaEdit /></button>
            <button onClick={handleDeleteClick}><MdDeleteForever /></button>
        </div>

        {showConfirm && (
            <ConfirmModal onConfirm={handleConfirm} onCancel={handleCancel} />
        )}
    </>
  )
}

export default ListActions